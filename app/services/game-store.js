import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { addFullName, letter2latin } from '../utils/city-functions';

const NUMberOfLetters = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

// let fullName = (city) => {
//   return city.first.toUpperCase() + city.middle + city.last;
// }

let bin = (city) => {
  return city.first.toUpperCase();
}

export default Service.extend({
  compPlayer: service(), 

  addCityToHistory(city) {
    
    this.get('movesHistory.all').pushObject(city);
    this.get('movesHistory.unsorted.'+bin(city)).pushObject(city);
  },
  addUserMove2History(city) {
    this.addCityToHistory(city);
    this.get('playstring').pushObject({val: city.middle, class: 'user-word'});
    this.get('playstring').pushObject({val: city.last, class: 'chain-letter'});
  },
  addCompMove2History(city) {
    this.addCityToHistory(city);
    this.get('playstring').pushObject({val: city.middle, class: 'comp-word'});
    this.get('playstring').pushObject({val: city.last, class: 'chain-letter'});
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
    this.set('movesHistory.all', []);
    this.set('movesHistory.unsorted', {});
    for(let i = 0; i < NUMberOfLetters; i++) {
      let origProp = 'movesHistory.unsorted.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      let sortProp = 'movesHistory.'+ String.fromCharCode(i + 'A'.charCodeAt(0));
      this.set(origProp, []);
      this.set(sortProp, computed(origProp, () => {return this.get(origProp).sortBy('fullName');}));
    }

    // init other game parameters
    this.set('round', 1);
    this.set('entered', '');

    // get a city to start 
    this.set('playstring', [{
      val: "Melbur",
      class: "comp-word"
    }, {
      val: "N",
      class: "chain-letter"
    }
    ]);
    this.set('lastLetter', "N");
    
    
    this.addCityToHistory({first: 'M', middle: 'elbur', last: 'n', fullName: 'Melburn'});
    
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
    this.set('lastUsedId', this.get('lastUsedId')+1);
    let meta = {id: this.get('lastUsedId'), round: this.get('round')};
    // send the move to the comp player
    this.get('compPlayer').userMoves(userCity, this.get('movesHistory.'+ userCity.last.toUpperCase()), meta)
                          .then((val) => { this.gotResponce(this, val); });
  },
  gotResponce(self, responce) {
    if (responce.original.meta.id <= self.get('lastProcessedId')) {
      return;
    }
    if (responce.original.meta.round !== self.get('round')) {
      return;
    }
    if(responce.status === 'ok') {
      self.set('entered', ''); // this.clearEntry();
      self.set('lastProcessedId', responce.original.meta.id);
      self.set('round', self.get('round') + 1);
      self.addUserMove2History(responce.original.city);
      self.addCompMove2History(responce.compMove.city);
      
    }
  },
  init() {
    this._super(...arguments);
    this.lastUsedId=0;
    this.newGame();
  }
});