import Kefir from 'kefir';

import {events} from './emitter';
import dom from './dom';

const style = document.createElement('style');

style.innerHTML = `
  .__fm-selected {
    background-color: rgba(30, 30, 200, 0.5) !important;
  }
`;

document.head.appendChild(style);

var selectFont = Kefir
  .fromEvents(events, 'selectFont')
  .flatMapLatest(function(config){
    let click = Kefir.fromEvents(document.body, 'click');
    return Kefir
      .fromEvents(document.body, 'mouseover')
      .filter(function(e){
        return e.target !== document.body &&
          e.path.every((el) => el.id !== 'fontmarklet');
      })
      .combine(Kefir.constant(config))
      .takeUntilBy(click)
      .beforeEnd(() => null);
  });

selectFont
  .onValue(function(val){
    if(val){
      let [e] = val;
      e.target.classList.add('__fm-selected');
    }
  });

selectFont
  .slidingWindow(2, 2)
  .onValue(function([val]){
    if(val){
      let [e] = val;
      console.log("test", arguments);
      e.target.classList.remove('__fm-selected');
    }
  });

export default selectFont;
