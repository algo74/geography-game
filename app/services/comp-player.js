import Service from '@ember/service';
import { Promise } from 'rsvp';

const a = 'a'.charCodeAt(0);
const z = 'z'.charCodeAt(0);
const NUMberOfLetters = z - a + 1;
const randomLetter = () => {
  return String.fromCharCode(Math.floor(Math.random()*NUMberOfLetters) + a);
}

const addFullName = (city) => {
  city.fullName = city.first.toUpperCase() + city.middle + city.last;
}

export default Service.extend({
  playerMoves(city, pastLetterHistory, meta) {
    let response = { status: 'ok', original: {city: city, meta: meta}};
    let middle = '';
    let middleLength = Math.floor(Math.random()*10);
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
