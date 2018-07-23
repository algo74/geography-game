import Component from '@ember/component';

export default Component.extend({
  input: null,
  dummy: null,
  init() {
    this._super(...arguments);
    console.log('init playstring');
    const position = this.entered.length;
    this.position = { start: position, end: position };
  },
  getCaretPosition(ctrl) {
    // IE < 9 Support
    if(document.selection) {
      ctrl.focus();
      var range = document.selection.createRange();
      var rangelen = range.text.length;
      range.moveStart('character', -ctrl.value.length);
      var start = range.text.length - rangelen;
      return { 'start': start, 'end': start + rangelen };
    }
    // IE >=9 and other browsers
    else if(ctrl.selectionStart || ctrl.selectionStart == '0') {
      return { 'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
    } else {
      return { 'start': 0, 'end': 0 };
    }
  },
  setCaretPosition(ctrl, start, end) {
    // IE >= 9 and other browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(start, end);
    }
    // IE < 9
    else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  },
  getInput() {
    if(!this.input) {
      this.input = this.$('#player-input');
    }
    return this.input;
  },
  didRender() {
    this.setCaretPosition(this.getInput()[0], this.position.start, this.position.end);
  },
  actions: {
    handleSubmit() {
      this.get('delegateSubmit')()
        .then((isMoved) => {
          if (isMoved) {
            // reset input
            //this.getInput();
            //this.input.val('');
            this.send('handleInput');
          }
      });
      
      
    },
    handleFocus() {
      //console.log("focus in");
      let input=this.getInput();
      setTimeout(function() {
        let length = input.val().length;
        input[0].setSelectionRange(length,length);
      }, 0);
    },
    handleInput() {
      // get fields
      this.getInput();
      if(!this.dummy) {
        this.dummy = this.$('#player-input-dummy');
      }
      // save caret position
      this.position = this.getCaretPosition(this.input[0]);
      // resize
      this.dummy.html(this.input.val());
      this.input.width(this.dummy.width() || 1);
      //restore caret position, in case it won't rerended...
      this.setCaretPosition(this.input[0], this.position.start, this.position.end);
    }
  }
});
