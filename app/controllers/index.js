import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

//TODO: fix disapearing cursor in Firefox
//TODO: focus on the input field by default
export default Controller.extend({
  gameStore: service('game-store'),
  inpVal: '',
  
  actions: {
    handleSubmit() {
      return this.get('gameStore').move().then((message) => {
        if (message && message !== true) {
          if (message === 'not found') {
            message = 'I know almost 100 thousand cities but not this one. Try something else.';
          } else if (message === 'error') {
            message = 'Something went wrong. Please try again. Please contact developer if the error persists.';
          }
          this.transitionToRoute('index.modal', {
            queryParams: { title: message }
          });
        }
        return message === true;
      });
    },
    onCitySelect(city) {
      this.get('gameStore').set('selectedCity', null); // a little hack to recenter map on wide screens if the same city is clicked 
      this.get('gameStore').set('selectedCity', city);
      this.get('gameStore').set('doShowInfo', $('.info-panel').css('position') === 'fixed'); // set to true only if info-panel in fullscreen mode

    },
    
    onCloseInfo() {
      this.get('gameStore').set('doShowInfo', false);
    }
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
