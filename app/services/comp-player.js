import Service from '@ember/service';

import $ from 'jquery';

//import {addFullName} from '../utils/city-functions';

// const a = 'a'.charCodeAt(0);
// const z = 'z'.charCodeAt(0);
// const NUMberOfLetters = z - a + 1;
// const randomLetter = () => {
//   return String.fromCharCode(Math.floor(Math.random()*NUMberOfLetters) + a);
// }



export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('url', 'https://geography-server.herokuapp.com/api/');
  },
  userMoves(city, meta) {
    return $.ajax({
      method: 'POST',
      url: this.get('url') + 'move',
      cache: false,
      data: {
        city: city,
        meta: meta
      },
      timeout: 10000,
    }).then(function (compResp) {
      // console.log('got back from server');
      // console.log(compResp);
      return compResp;
      }).catch (function(e) {
        console.log('error: ' + JSON.stringify(e));
        return {
          status: 'error',
          original: { meta: meta },
          error: e || 'error in ajax(comp-player)'
        }
      });
    // response.compMove = {city: newCity};
    // let promise = new Promise((resolve) => {
    //   resolve(response);
    // })
    // return promise;
  }
});
