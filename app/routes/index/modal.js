import Route from '@ember/routing/route';
import $ from 'jquery';


export default Route.extend({
  queryParams: {
    title: {
      refreshModel: true
    }
  },
  model(params, transition) {
    return {
      title: transition.queryParams.title
    };
  },
  setupController(controller, model) {
    this._super(controller, model);//don't forget this setup line!
    controller.set('title', undefined);
  },
  actions: {
    willTransition() {
      let input = $('#player-input');
      input[0].focus();
      return true;
    }
  }
  
});
