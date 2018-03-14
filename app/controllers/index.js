import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

const BACKSPACE = 8;

//TODO: fix disapearing cursor in Firefox
//TODO: focus on the input field by default
export default Controller.extend({
  gameStore: service('game-store'),
  inpVal: '',
  actions: {
    handleInput(val,event) {
      let key = event.originalEvent.keyCode;
      if (key===BACKSPACE) {
        this.get('gameStore').sliceEntered();
      } else {
        //TODO: help if nothing entered
        this.get('gameStore').updateEntered(val.slice(-1));
      }
      this.set('inpVal', '');
    }
  }
});
