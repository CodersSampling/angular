import {Component} from '@angular/core';

@Component({
  template: `
    <div>
      {{message}}
      {#for item of items; track item}
        {{item.name}}
        {:empty} No items!
      {/for}
    </div>
  `,
})
export class MyApp {
  message = 'hello';
  items = [{name: 'one'}, {name: 'two'}, {name: 'three'}];
  item: any;  // TODO(crisbeto): remove this once template type checking is fully implemented.
}
