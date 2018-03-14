import { module, test } from 'qunit';
import { letter2latin, isBasicLetter } from 'geography-game/utils/city-functions';

module('Unit | Utility | city-functions', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    
    assert.ok(true);
  });

  test('isBasicLetter works', function(assert) {
    assert.ok(isBasicLetter('a'), 'a is good');
    assert.ok(isBasicLetter('A'), 'A is good');
    assert.ok(isBasicLetter('z'), 'z is good');
    assert.ok(isBasicLetter('m'), 'm is good');
    
    assert.notOk(isBasicLetter('aa'), 'longer string');
    assert.notOk(isBasicLetter(''), 'empty string');
    assert.notOk(isBasicLetter('3'), '3 is not good');
    assert.notOk(isBasicLetter('^'), '^ is not good');
  });

  test('letter2latin passes through good letters', function(assert) {
    assert.equal(letter2latin('a'), 'a', "a must be latin");
    
  });

  test('letter2latin stops bad letters', function(assert) {
    assert.equal(letter2latin('3'), '', "number");
    assert.equal(letter2latin('ы'), '', 'cyrillic');
  });
});
