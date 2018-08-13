import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';


export default Route.extend({
  gameStore: service('game-store'),
  setupController(controller, model) {
    this._super(controller, model);//don't forget this setup line!
    this.get('gameStore').set('doShowInfo', true);
  },
  actions: {
    willTransition() {
      this.get('gameStore').set('doShowInfo', false);
      let input = $('#player-input');
      input[0].focus();
      return true;
    }
  }
});
