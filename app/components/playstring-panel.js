import Component from '@ember/component';

export default Component.extend({
  input: null,
  dummy: null,
  getInput() {
    if(!this.input) {
      this.input = this.$('#player-input');
    }
    return this.input;
  },
  didRender() {
    this.getInput().focus();

  },
  actions: {
    handleSubmit() {
      this.get('delegateSubmit')();
      // reset input
      this.getInput();
      this.input.val('');
      this.input.width('1px');
    },
    handleFocus() {
      console.log("focus in");
      let input=this.getInput();
      setTimeout(function() {
        let length = input.val().length;
        input[0].setSelectionRange(length,length);
      }, 0);
    },
    handleInput() {
      
      this.getInput();
      if(!this.dummy) {
        this.dummy = this.$('#player-input-dummy');
      }
      
      this.dummy.html(this.input.val());
      this.input.width(this.dummy.width() || 1);
      console.log(this.dummy.width() );
    }
  }
});
