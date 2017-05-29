import { Component } from '@angular/core';

/**
 * class for the TitleBarComponent component.
 */
@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  // toggle for searchbar
  public searchbarToggled: boolean;

  constructor() {
    // set default value
    this.searchbarToggled = false;
  }

  // Toggle searchbar variable to show/hide searchbar and icons
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
