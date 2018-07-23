import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  maps: service(),
  didRender() {
    console.log('update map');
    this._super(...arguments);
    let city = this.get('data');
    console.log('inside infopanel; city: ');
    console.log(city);
    let mapElement = this.get('maps').getMapElement(city);
    this.$('.map-container').empty().append(mapElement);
  },
  actions: {
    onCloseInfo() {
      this.get('onClose')();
    }
  }
});
