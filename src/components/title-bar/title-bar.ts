import { Component, Input } from '@angular/core';
import { Logger } from "../../app/logger";

@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // input variables
  @Input() title: String;
  
  // searchbar toggle
  public searchbarToggled: boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {
    // set default value
    this.searchbarToggled = false;
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
