import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

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
  sliceEntered() {
    this.set('entered', this.get('entered').slice(0,-1));
  },
  updateEntered(letter) {
    this.set('entered', this.get('entered')+letter);
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
  move(playerInput) {
    if(playerInput === '') {
      return false;
    }
    // send the move to the comp player
  },
  init() {
    this._super(...arguments);
    this.lastUsedId=0;
    this.newGame();
  }
});
