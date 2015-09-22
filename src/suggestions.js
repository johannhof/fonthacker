import Kefir from 'kefir';

import fonts from './fonts';
import {events} from './emitter';

export default Kefir
  .fromEvents(events, 'suggestions')
  .combine(fonts, function(input, _fonts){
    return _fonts.filter(function (val) {
        return val.family.indexOf(input) === 0;
    });
  })
  .toProperty(() => []);

    //if(filtered.length > 0 && filtered.length < 10){
      //// preload fonts
      //loader.load(filtered);
    //}
