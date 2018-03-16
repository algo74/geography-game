import Component from '@ember/component';

export default Component.extend({
  actions: {
    handleSubmit() {
      this.get('delegateSubmit')();
      // reset input
      let input = this.$('#player-input');
      input.val('');
      input.width('1px');
    },
    handleInput() {
      
      let input = this.$('#player-input');
      let dummy = this.$('#player-input-dummy');
      dummy.html(input.val());
      input.width(dummy.width() || 1);
      console.log(dummy.width() );
    }
  }
});
