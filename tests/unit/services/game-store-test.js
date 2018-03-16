import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | game-store', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:game-store');
    assert.ok(service);
  });

  test('it initialized', function(assert) {
    let service = this.owner.lookup('service:game-store');
    assert.ok(service.playstring, "playstring is present");
    assert.equal(service.playstring[1].class,'chain-letter', 'playstring is initialized okey');
    assert.ok(service.get('movesHistory.Z'), 'movesHostory inits okey');
    assert.equal(service.movesHistory.all[0].fullName, 'Melburn', 'Melburn added to all history');
    assert.equal(service.movesHistory.unsorted.M[0].fullName, 'Melburn', 'Melburn added to M history');
    assert.ok(service.get('movesHistory.M'), 'movesHostory M inits okey');
    assert.equal(service.get('movesHistory.M').length, 1, 'M sorted history has one entry');
    assert.equal(service.get('movesHistory.M')[0].fullName, 'Melburn', 'Melburn added to M sorted history');
    
  });

  test('it adds new city', function(assert) {
    let service = this.owner.lookup('service:game-store');
    let city = {first: "N", middle: 'ea', last: 'm', fullName: 'Neam'};
    service.addCityToHistory(city);
    assert.equal(service.get('movesHistory.all').length, 2, 'city added to all');
    assert.equal(service.get('movesHistory.unsorted.N')[0].fullName, 'Neam', 'city added to its unsorted letter');
    assert.equal(service.get('movesHistory.N')[0].fullName, 'Neam', 'city added to its sorted letter');
  });
});

