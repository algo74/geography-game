import EmberObject from '@ember/object';

const google = window.google;

export default EmberObject.extend({
  
  createMap(element, city) {
    let map = new google.maps.Map(element, { scrollwheel: false, zoom: 10 });
    let position = { lat: +city.coords.lat, lng: +city.coords.lng };
    map.setCenter(position);
    //new google.maps.Marker({ position, map, title: city.fullName });
    return map;
  },

  repositionMap(map, city) {
    let position = { lat: +city.coords.lat, lng: +city.coords.lng };
    map.setCenter(position);
    map.setZoom(10);
    //new google.maps.Marker({ position, map, title: city.fullName });
  }
})