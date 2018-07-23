import Service from '@ember/service';

import MapUtil from '../utils/google-maps';

export default Service.extend({
  init() {
    this._super(...arguments);
    
    if (!this.get('mapUtil')) {
      let mapUtil = MapUtil.create();
      this.set('mapUtil',mapUtil);
    }
  },

  getMapElement(city) {
    let elements = this.get('elements');
    if (!elements) {
      let htmlElement = this.createMapElement();
      let map = this.get('mapUtil').createMap(htmlElement, city);
      elements = { html: htmlElement, map: map };
      this.set('elements', elements);
    }
    this.get('mapUtil').repositionMap(elements.map, city);
    return elements.html;
  },

  createMapElement() {
    let element = document.createElement('div');
    element.className = 'map';
    return element;
  }
});
