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
    assert.ok(service.movesHistory.Z, 'movesHostory inits okey');
    assert.equal(service.movesHistory.all[0].fullName, 'Melburn', 'Melburn added to all history');
    assert.equal(service.movesHistory.unsorted.M[0].fullName, 'Melburn', 'Melburn added to M history');
    assert.ok(service.movesHistory.M, 'movesHostory M inits okey');
    assert.equal(service.get('movesHistory.M')[0].fullName, 'Melburn', 'Melburn added to M sorted history');
    
  });
});

