import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  actions: {
    back() {
      history.back();
      let input = $('#player-input');
      input[0].focus();
    },
    doNothing() {
      return false;
    }
  },
  didRender() {
    this.$('#modal_alert button')[0].focus();
  }
});
