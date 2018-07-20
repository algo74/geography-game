import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

const BACKSPACE = 8;

//TODO: fix disapearing cursor in Firefox
//TODO: focus on the input field by default
export default Controller.extend({
  gameStore: service('game-store'),
  inpVal: '',
  
  actions: {
    handleSubmit() {
      return this.get('gameStore').move();
    },
    // handleInput(val,event) {
    //   let key = event.originalEvent.keyCode;
    //   if (key===BACKSPACE) {
    //     this.get('gameStore').sliceEntered();
    //   } else {
    //     //TODO: help if nothing entered
    //     //TODO: move letter2latin here
    //     this.get('gameStore').updateEntered(val);
    //   }
    //   this.set('inpVal', '');
    // }
  }
});
