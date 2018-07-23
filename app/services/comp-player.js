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
    this.set('url', 'http://localhost:9090/api/');
  },
  userMoves(city, lastLetterHistory, meta) {
    //console.log(pastLetterHistory);
    //let response = {original: {city: city, meta: meta}};
    // let middle = '';
    // let middleLength = Math.floor(Math.random()*10)+1;
    // for (let i = 0; i < middleLength; i++) {
    //   middle += randomLetter();
    // }
    
    // let newCity = {first: city.last.toUpperCase(), middle: middle, last: randomLetter()};
    // addFullName(newCity);
    return $.ajax({
      method: 'POST',
      url: this.get('url') + 'move',
      cache: false,
      data: {
        city: city,
        lastLetterHistory: lastLetterHistory,
        meta: meta
      },
      timeout: 2000,
      // success: function (compResp) {
      //   console.log('got back from server');
      //   console.log('compRest');
      //   response.status = compResp.status;
      //   response.city = compResp.city;
      // }
    }).then(function (compResp) {
      console.log('got back from server');
      console.log(compResp);
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
