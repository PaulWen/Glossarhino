import { Component, Input, EventEmitter } from '@angular/core';

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

  // variable for setting focus on searchbar
  public focusTriggerEventEmitter = new EventEmitter<boolean>();

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

  // set focus on searchbar with directive
  private setFocus() {
    this.focusTriggerEventEmitter.emit(true);
  }

  // resolve input for searchbarFocus and set searchbarFocus onInit
  ngOnInit() {
    if (this.searchbarFocus)
      this.setFocus()
  }
}