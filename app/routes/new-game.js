import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  gameStore: service('game-store'),
  beforeModel(/* transition */) {
    console.log('new game');
    this.get('gameStore').newGame();
    this.transitionTo('index'); // Implicitly aborts the on-going transition.
  }
});
