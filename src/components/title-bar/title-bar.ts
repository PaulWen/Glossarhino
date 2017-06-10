import { Component, Input, ViewChild } from '@angular/core';
import { Searchbar } from "ionic-angular";

@Component({
  selector: '[title-bar]',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  // input variables
  @Input() title: String;
  @Input() searchbarToggled: boolean;
  @Input() searchbarFocus: boolean;

  // Searchbar Variable for access on searchbar
  @ViewChild('searchbar') searchbar: Searchbar;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // method to toggle searchbar and icons
  private toggleSearch() {
    this.searchbarToggled = this.searchbarToggled ? false : true;
  }

  // Handle events of searchbar
  private onInput(event: Event) {
  }

  private onCancel(event: Event) {
    this.toggleSearch()
  }

  private onClear(event: Event) {
    this.toggleSearch()
  }

  // resolve input for searchbarFocus and set searchbarFocus onInit
  ngOnInit() {
    this.toggleSearch();
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 2000);
  }
}