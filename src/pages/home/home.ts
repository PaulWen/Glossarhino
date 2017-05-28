import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingleEntryPage } from "../single-entry/single-entry";
import { DummyHome } from "./dummy-class-home";

// Interface to define what this page needs implemented in order to work
export interface HomePageInterface {
  getDepartments: () => Array<String>;
}

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
  onInput(event: Event) {
  }

  onCancel(event: Event) {
    this.toggleSearch()
  }

  // Get departments, currently out of dummy implementation
  private dummyObject: DummyHome = new DummyHome();
  private departments: Array<String> = this.dummyObject.getDepartments();

}
