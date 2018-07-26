import { helper } from '@ember/component/helper';

export function charhue(char) {
  return ('Z'.charCodeAt(0) - 'A'.charCodeAt(0)) / 255 * (char.charCodeAt(0) - 'A'.charCodeAt(0));
}

export default helper(charhue);