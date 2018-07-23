import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  histViewSelected: 'all',
  histViewPanel: computed('gameStore.movesHistory.all.length', 'histViewSelected', function() {
    //console.log('recalculating '+ this.get('histViewSelected'));
    return this.get('gameStore').get('movesHistory.'+ this.get('histViewSelected')); 
  }),
  actions: {
    changeHistoryView() {
      let selected =this.$('#hist-view-select option:selected').text();
      this.set('histViewSelected', selected);
      //console.log(this.histViewSelected);
    },
    selectCity(city) {
      this.get('onCitySelect')(city);
    }
  }
});
