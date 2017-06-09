import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  // input variables
  @Input() title: String;
  @Input() searchbarToggled: Boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {
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