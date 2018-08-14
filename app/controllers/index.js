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
            message = 'Something went wrong. Please check your connection and try again. Please contact developer if the error persists.';
          } else if (message === 'timeout') {
            message = 'Could not connect to server. It could be still waking up. Please try again in a few seconds.';
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
      if ($('.info-panel').css('position') === 'fixed') {
      // info-panel is in fullscreen mode
        this.transitionToRoute('index.map');
        //this.get('gameStore').set('doShowInfo', true); 
      }
      

    },
    
    onCloseInfo() {
      history.back();
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
