import { Component } from '@angular/core';

/**
 * Generated class for the TitleBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // searchbar toggle
  public searchbarToggled: boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {
    // set default value
    this.searchbarToggled = false;

    console.log('Hello TitleBarComponent Component');
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // method to toggle searchbar and icons
  toggleSearch() {
    this.searchbarToggled = this.searchbarToggled ? false : true;
  }

  // Handle events of searchbar
  onInput(event: Event) {
  }

  onCancel(event: Event) {
    this.toggleSearch()
  }

  onClear(event: Event) {
    this.toggleSearch()
  }

}
