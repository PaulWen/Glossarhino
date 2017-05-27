import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingleEntryPage } from "../single-entry/single-entry";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // Variable SingleEntryPage for navigation purposes
  singleEntryPage = SingleEntryPage;

  // Toggle variable for searchbar
  public searchbarToggled: boolean;

  constructor(public navCtrl: NavController) {
    this.searchbarToggled = false;
  }

  // Toggle searchbar variable to show/hide searchbar and icons
  toggleSearch() {
       this.searchbarToggled = this.searchbarToggled ? false : true;
  }


  // Handle events of searchbar
  onInput (event: Event) {
  }

  onCancel (event: Event) {
    this.toggleSearch()
  }

}
