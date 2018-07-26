import Route from '@ember/routing/route';

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
  }
  
});
