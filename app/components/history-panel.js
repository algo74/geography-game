import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  histViewSelected: 'all',
  histViewPanel: computed('gameStore.movesHistory.all.length', 'histViewSelected', function() {
    return this.get('gameStore').get('movesHistory.'+ this.get('histViewSelected')); 
  }),
  actions: {
    changeHistoryView() {
      let selected =this.$('#hist-view-select option:selected').text();
      this.set('histViewSelected', selected);
    },
    selectCity(city) {
      this.get('onCitySelect')(city);
    }
  }
});
