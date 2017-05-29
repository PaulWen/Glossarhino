import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DummyHome } from "./dummy-class-home";
import { HomePageInterface } from "./home-interface";
import { Logger } from "../../app/logger";
import { EntryListPage } from "../entry-list/entry-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // toggle for searchbar
  public searchbarToggled: boolean;

  // interact with model
  private homePageInterface: HomePageInterface;

  constructor(public navCtrl: NavController) {
    // set default value
    this.searchbarToggled = false;

    // instantiate model object for interaction and get data
    this.homePageInterface = new DummyHome();
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

  // Navigation method for departments
  pushList(department: String) {
    this.navCtrl.push(EntryListPage, {
      department: department
    })
  }
}
