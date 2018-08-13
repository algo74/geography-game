import Component from '@ember/component';

export default Component.extend({
  actions: {
    back() {
      history.back();
    },
    doNothing() {
      return false;
    }
  },
  didRender() {
    this.$('#modal_alert button')[0].focus();
  }
});
