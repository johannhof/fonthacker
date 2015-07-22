const Emitter = function(){
  this.listeners = {};
};

Emitter.prototype.on = function(subject, cb){
  this.listeners[subject] = cb;
};

Emitter.prototype.off = function(subject){
  delete this.listeners[subject];
};

Emitter.prototype.trigger = function(subject, args){
  this.listeners[subject] && this.listeners[subject].apply(null, args);
};

export const events = new Emitter();

export const EmitterMixin = {
  emit(subject, ...args){
    return function(...args2){
      events.trigger(subject, args.concat(args2));
    };
  }
};

