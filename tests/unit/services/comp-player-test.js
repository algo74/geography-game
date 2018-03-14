import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | comp-player', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:comp-player');
    assert.ok(service);
  });

  test('it returns something', function(assert) {
    let service = this.owner.lookup('service:comp-player');
    let city = {first: 'M', middle: 'elbur', last: 'n', fullName: 'Melburn' };
    let history = [];
    let meta = {test: 'passed'};

    service.userMoves(city, history,  meta).then( (val) => {
      assert.ok(val, 'something is returned');
      assert.ok(val.status, 'status is set');
      assert.ok(val.original, 'original is set');
      assert.equal(val.original.meta, meta, 'meta is returned unchanged');
      assert.equal(val.original.city, city, 'origial city is returned unchanged');
    });
  });

  test('it returns a comp move', function(assert) {
    let service = this.owner.lookup('service:comp-player');
    let city = {first: 'M', middle: 'elbur', last: 'n', fullName: 'Melburn' };
    let history = [];
    let meta = {test: 'passed'};

    service.userMoves(city, history,  meta).then( (val) => {
      
      assert.equal(val.compMove.city.first, city.last.toUpperCase(), 'new city first is the same as old city last');
      assert.ok(val.compMove.city.middle, 'middle is present');
      assert.ok(val.compMove.city.last, 'last is present');
      assert.ok(val.compMove.city.fullName, 'full name is present');
    });
  });
});

