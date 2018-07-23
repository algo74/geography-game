import Service from '@ember/service';

import { camelize } from '@ember/string';
import EmberObject from '@ember/object';

import MapUtil from '../utils/google-maps';

export default Service.extend({
  init() {
    this._super(...arguments);
    if (!this.get('cachedMaps')) {
      this.set('cachedMaps', EmberObject.create());
    }
    if (!this.get('mapUtil')) {
      let mapUtil = MapUtil.create();
      this.set('mapUtil',mapUtil);
    }
  },

  getMapElement(city) {
    // let camelizedLocation = camelize(city.fullName);
    // console.log('camelizedLocation: ', camelizedLocation);
    // let element = this.get(`cachedMaps.${camelizedLocation}`);
    // console.log('element: ', element);
    // if (!element) {
    //   element = this.createMapElement();
    //   this.set('currentMap', this.get('mapUtil').createMap(element, city));
    //   this.set(`cachedMaps.${camelizedLocation}`, element);
    // } else {
    //   console.log('reusing element');
    //   this.get('currentMap').panTo({ lat: +city.coords.lat, lng: +city.coords.lng });
    // }
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
