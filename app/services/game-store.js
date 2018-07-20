import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { defineProperty } from '@ember/object';

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
  
  addCityToHistory(city) {
    let index = this.get('movesHistory.unsorted.'+bin(city)).length;
    this.get('movesHistory.unsorted.'+bin(city)).pushObject(city);
    this.get('movesHistory.all').pushObject(city);
    this.get('movesHistory.unsorted.'+bin(city)).arrayContentDidChange(index,0,1);
  },
  addUserMove2History(city) {
    this.addCityToHistory(city);
    this.get('playstring').pushObject({
      val: city.middle,
      class: 'user-word',
      color: 'black'
    });
    this.get('playstring').pushObject({
      val: city.last,
      class: 'chain-letter',
      color: 'hsl(' + (this.get('round') * 37 % 130 + 50) + ', 100%, 50%)'
    });
  },
  addCompMove2History(city) {
    this.addCityToHistory(city);
    this.get('playstring').pushObject({
      val: city.middle,
      class: 'comp-word',
      color: 'blue'
    });
    this.get('playstring').pushObject({
      val: city.last,
      class: 'chain-letter',
      color: 'hsl(' + ((this.get('round') * 41 % 130 + 280) % 360) + ', 100%, 50%)'
    });
    this.set('lastLetter', city.last);
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
    for(let i = 0; i < NUMberOfLetters; i++) {
      let origProp = 'movesHistory.unsorted.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      let sortProp = 'movesHistory.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      this.set(origProp, A());
      defineProperty(this, sortProp, computed(origProp+'.[]', () => {
        //console.log('recalculating '+origProp);
        //console.log(this.get(origProp).length);
        return this.get(origProp).sortBy('fullName');
      }));
      // this.set(sortProp, computed.sort(origProp, function(a, b){
      //   console.log('a: '+a);
      //   if(!b) {
      //     if(!a) return 0;
      //     return 1;
      //   }
      //   if(!a) {
      //     return -1;
      //   }
      //   if (a.fullName > b.fullName) {
      //     return 1;
      //   } 
      //   return -1;
      // }));
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
    
    
    this.addCityToHistory({ first: 'M', middle: 'elbourn', last: 'e', fullName: 'Melbourne'});
    
  },
  move() {
    let entered = this.get('entered');
    if(entered === '') {
      alert('nothing is entered');
      return false;
    }
    //prepare user move
    //TODO: check for correct input
    let userCity = {first: this.get('lastLetter').toUpperCase(), middle: this.get('entered').slice(0,-1), last: this.get('entered').slice(-1)  };
    addFullName(userCity);
    //final check
    if(!letter2latin(userCity.last)) {
      alert('last letter is not good');
      return false;
    }
    // check local history
    let localHistory = this.get('movesHistory.' + userCity.first.toUpperCase());
    for (let city of localHistory) {
      if (city.fullName.toUpperCase() === userCity.fullName.toUpperCase()) {
        alert('This city was already used');
        return false;
      }
    }
    this.set('lastUsedId', this.get('lastUsedId')+1);
    let meta = {id: this.get('lastUsedId'), round: this.get('round')};
    // send the move to the comp player
    return this.get('compPlayer')
    .userMoves(userCity, this.get('movesHistory.' + userCity.last.toUpperCase()), meta)
    .then((val) => { return this.gotResponce(this, val); });
  },
  gotResponce(self, responce) {
    console.log('got response');
    console.log(responce);
    if (+responce.original.meta.id <= self.get('lastProcessedId')) {
      console.log('old id');
      return false;
    }
    if (+responce.original.meta.round !== self.get('round')) {
      console.log('wrong round');
      return false;
    }
    if(responce.status === 'ok') {
      self.set('entered', ''); // this.clearEntry();
      self.set('lastProcessedId', responce.original.meta.id);
      self.set('round', self.get('round') + 1);
      self.addUserMove2History(responce.original.city);
      self.addCompMove2History(responce.compMove.city);
      return true;
    } else {
      alert(responce.status);
      return false;
    }
  },
  init() {
    this._super(...arguments);
    this.lastUsedId=0;
    this.sortOrder = ['fullName','first'];
    this.newGame();
  }
});
