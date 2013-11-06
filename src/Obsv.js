/**
 * Super simple observer system.
 */
var events = {};

var Obsv = function(){
  // nothing yet
};

Obsv.prototype.on = function(event, callback){
    if(events[event]){
        events[event].push(callback);
    }else{
        events[event] = [callback];
    }
};

Obsv.prototype.emit = function(event){
    var eventArray = events[event], i;
    for(i = 0; i < eventArray.length; i++){
        eventArray[i]();
    }
};

module.exports = Obsv;
