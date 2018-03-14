import Service from '@ember/service';
import { Promise } from 'rsvp';
import {addFullName} from '../utils/city-functions';

const a = 'a'.charCodeAt(0);
const z = 'z'.charCodeAt(0);
const NUMberOfLetters = z - a + 1;
const randomLetter = () => {
  return String.fromCharCode(Math.floor(Math.random()*NUMberOfLetters) + a);
}



export default Service.extend({
  userMoves(city, pastLetterHistory, meta) {
    let response = { status: 'ok', original: {city: city, meta: meta}};
    let middle = '';
    let middleLength = Math.floor(Math.random()*10)+1;
    for (let i = 0; i < middleLength; i++) {
      middle += randomLetter();
    }
    
    let newCity = {first: city.last.toUpperCase(), middle: middle, last: randomLetter()};
    addFullName(newCity);
    response.compMove = {city: newCity};
    let promise = new Promise((resolve) => {
      resolve(response);
    })
    return promise;
  }
});
