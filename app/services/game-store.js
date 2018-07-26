import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { defineProperty } from '@ember/object';
import { htmlSafe } from '@ember/string'

import { addFullName, letter2latin } from '../utils/city-functions';

const NUMberOfLetters = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

// let fullName = (city) => {
//   return city.first.toUpperCase() + city.middle + city.last;
// }

function bin(city) {
  return city.first.toUpperCase();
}

export default Service.extend({
  compPlayer: service(), 
  
  addAliases(city) {
    let aliases = this.get('usedAliases');
    let name = city.fullName;
    city.aliases.forEach(value => aliases[value] = name);
    this.set('usedAliases', aliases);
  },

  hasSeenCity(name) {
    let aliases = this.get('usedAliases');
    return aliases[name.toLowerCase()] || false;
  },

  addCityToHistory(city) {
    let index = this.get('movesHistory.unsorted.'+bin(city)).length;
    this.get('movesHistory.unsorted.'+bin(city)).pushObject(city);
    this.get('movesHistory.all').pushObject(city);
    this.get('movesHistory.unsorted.' + bin(city)).arrayContentDidChange(index, 0, 1);
    this.addAliases(city);
  },
  addUserMove2History(city) {
    this.addCityToHistory(city);
    this.get('playstring').pushObject({
      val: city.middle,
      class: 'user-word',
      style: htmlSafe('color: black')
    });
    this.get('playstring').pushObject({
      val: city.last,
      class: 'chain-letter',
      style: htmlSafe('color: hsl(' + (this.get('round') * 37 % 130 + 50) + ', 100%, 50%);')
    });
  },
  addCompMove2History(city) {
    // add needed fields
    city.fullName = city.name;
    city.first = letter2latin(city.name.slice(0, 1));
    city.last = letter2latin(city.name.slice(-1));
    city.middle = city.name.slice(1, -1);

    this.addCityToHistory(city);
    this.get('playstring').pushObject({
      val: city.middle,
      class: 'comp-word',
      style: htmlSafe('color: black')
    });
    this.get('playstring').pushObject({
      val: city.last,
      class: 'chain-letter',
      style: htmlSafe('color: hsl(' + ((this.get('round') * 41 % 130 + 280) % 360) + ', 100%, 50%);')
    });
    this.set('lastLetter', city.last);
    // shorten playstring if needed
    this.adjustPlaystring();
    // update current city (for info-panel)
    this.set('selectedCity', city);
    
  },
  adjustPlaystring() {
    let playstring = this.get('playstring');
    if (playstring.length >= 100) {
      playstring = playstring.splice(0, 50);
      console.log('shortened playstring');
    }
  },
  sliceEntered() {
    this.set('entered', this.get('entered').slice(0,-1));
  },
  updateEntered(letter) {
    this.set( 'entered', this.get('entered') + letter.slice(-1) );
  },
  newGame() {
    // make sure that new game does't respond to older games messages
    this.lastUsedId++;
    this.lastProcessedId = this.lastUsedId;
    
    // init history
    // TODO: move some code to init
    this.set('movesHistory', {});
    this.set('movesHistory.all', A());
    this.set('movesHistory.unsorted', {});
    this.set('usedAliases', new Set());
    for(let i = 0; i < NUMberOfLetters; i++) {
      let origProp = 'movesHistory.unsorted.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      let sortProp = 'movesHistory.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      this.set(origProp, A());
      defineProperty(this, sortProp, computed(origProp+'.[]', () => {
        //console.log('recalculating '+origProp);
        //console.log(this.get(origProp).length);
        return this.get(origProp).sortBy('fullName');
      }));
    }

    // init other game parameters
    this.set('round', 1);
    this.set('entered', '');

    // get a city to start 
    // TODO: add colors
    this.set('playstring', [{
      val: "Melbourn",
      class: "comp-word"
    }, {
      val: "E",
      class: "chain-letter"
    }
    ]);
    this.set('lastLetter', "E");
    
    const startCity = {
      first: 'M',
      middle: 'elbourn',
      last: 'e',
      fullName: 'Melbourne',
      coords: {
        lat: -37.82003131,
        lng: 144.9750162
      },
      aliases: ["melbourne", "mel", "mel'burn", "melbourne city", "melbournum", "melburn", "melburna", "melburnas", "melburno", "melvourni", "mel beirn", "melaborna", "melbeoleun", "melbeon", "melporn", "meruborun", "mlbwrn", "mo er ben"]
    };
    this.addCityToHistory(startCity);
    // init info-panel
    this.set('selectedCity', startCity);

  },
  move() {
    let entered = this.get('entered');
    if(entered === '') {
      return new Promise(function (resolve) { resolve('nothing is entered') });
    }
    //prepare user move
    //TODO: check for correct input
    let userCity = {first: this.get('lastLetter').toUpperCase(), middle: this.get('entered').slice(0,-1), last: this.get('entered').slice(-1)  };
    addFullName(userCity);
    //final check
    if(!letter2latin(userCity.last)) {
      return new Promise(function (resolve) { resolve('last letter is not good') });
    }
    // check local history
    let seenCity = this.hasSeenCity(userCity.fullName)
    if (seenCity) {
      return new Promise(function (resolve) { resolve(`${seenCity}, i.e. this city has been already played`) });
    }
    this.set('lastUsedId', this.get('lastUsedId')+1);
    let meta = {id: this.get('lastUsedId'), round: this.get('round')};
    // send the move to the comp player
    return this.get('compPlayer')
    .userMoves(userCity, meta)
    .then((val) => { return this.gotResponce(this, val); });
  },
  gotResponce(self, responce) {
    // console.log('got response');
    // console.log(responce);
    if (+responce.original.meta.id <= self.get('lastProcessedId')) {
      console.log('old id');
      return false;
    }
    if (+responce.original.meta.round !== self.get('round')) {
      console.log('wrong round');
      return false;
    }
    if (responce.status === 'ok') {
      // note: no need to check the user city, we should check it before we sent
      self.set('entered', ''); // this.clearEntry();
      self.set('lastProcessedId', responce.original.meta.id);
      self.set('round', self.get('round') + 1);
      // update info for user city
      responce.original.city.coords = responce.userCity.coords;
      responce.original.city.aliases = responce.userCity.aliases; 
      // also update fullname (TODO)
      if (responce.userCity.name !== '' && responce.userCity.name != responce.original.city.fullName) {
        if (responce.userCity.name.toLowerCase() === responce.original.city.fullName.toLowerCase()) {
          responce.original.city.fullName = responce.userCity.name;
        } else {
          responce.original.city.fullName += ` (${responce.userCity.name})`;
        }
      }
      // save user move
      self.addUserMove2History(responce.original.city);
      // check if any of the computer cities are new
      let nCompCities = responce.compMove.length;
      for (let i = 0; i < nCompCities; i++) {
        let compCity = responce.compMove[i];
        if (!self.hasSeenCity(compCity.name)) {
          // save comp move
          self.addCompMove2History(compCity);
          return true;
        }
      }
      // no new cities in computer response
      
      return 'you won!';
    } else {
      return responce.status;
    }
  },
  init() {
    this._super(...arguments);
    this.lastUsedId=0;
    this.sortOrder = ['fullName','first'];
    this.newGame();
  }
});
