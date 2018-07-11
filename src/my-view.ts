import {BindingSignaler} from 'aurelia-templating-resources';
import {inject, NewInstance} from 'aurelia-framework';

@inject(NewInstance.of(BindingSignaler))
export class MyView {
  bindingSignaler: BindingSignaler;
  
  constructor(bindingSignaler) {
    this.bindingSignaler = bindingSignaler;
  }

  i=0;
  inc() {
    return this.i++;
  }

  update() {
    this.bindingSignaler.signal('update');
  }
}
