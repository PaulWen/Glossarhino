import { Component } from '@angular/core';

/**
 * class for the TitleBarComponent component.
 */
@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {

  text: string;

  constructor() {
    console.log('Hello TitleBarComponent Component');
  }

}
