/*
  Patched binding signal for optional local signaling by using the bindingSignaler proterty of the context if available. Eg:
  
  // main.js
  import 'patched-signal-binding-behavior.js';
  
  // my-view.js
  // Use a new instance of the BindingSignaler. Without the NewInstance the global one will be used and signals are global as usual
  @inject(NewInstance.of(BindingSignaler))
  export class MyView {
    constructor(bindingSignaler) {
      this.bindingSignaler = bindingSignaler;
    }
    aMethod() {
      // only signals to the own viewModel now
      this.bindingSignaler.signal('update');
    }
  }
  
  // One could also copy the original, patch it and use it locally with <require from.. . Global registration using the same name 'signal' is not possible.
*/

import {SignalBindingBehavior} from 'aurelia-templating-resources';

SignalBindingBehavior.prototype.bind = function(binding, source) {
  if (!binding.updateTarget) {
    throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
  }
  let signals = source.bindingContext.bindingSignaler ? source.bindingContext.bindingSignaler.signals : this.signals;
  if (arguments.length === 3) {
    let name = arguments[2];
    let bindings = signals[name] || (signals[name] = []);
    bindings.push(binding);
    binding.signalName = name;
  } else if (arguments.length > 3) {
    let names = Array.prototype.slice.call(arguments, 2);
    let i = names.length;
    while (i--) {
      let name = names[i];
      let bindings = signals[name] || (signals[name] = []);
      bindings.push(binding);
    }
    binding.signalName = names;
  } else {
    throw new Error('Signal name is required.');
  }
};

SignalBindingBehavior.prototype.unbind = function(binding, source) {
  let name = binding.signalName;
  binding.signalName = null;
  let signals = source.bindingContext.bindingSignaler ? source.bindingContext.bindingSignaler.signals : this.signals;
  if (Array.isArray(name)) {
    let names = name;
    let i = names.length;
    while (i--) {
      let n = names[i];
      let bindings = signals[n];
      bindings.splice(bindings.indexOf(binding), 1);
    }
  } else {
    let bindings = signals[name];
    bindings.splice(bindings.indexOf(binding), 1);
  }
};
