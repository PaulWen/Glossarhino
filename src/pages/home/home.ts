import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DummyHome } from "./dummy-class-home";
import { HomePageInterface } from "./home-interface";
import { EntryListPage } from "../entry-list/entry-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // toggle for searchbar
  public searchbarToggled: boolean;

  // access interface implementation
  private homePageInterface: HomePageInterface;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController) {
    // set default value
    this.searchbarToggled = false;

    // instantiate model object for interaction
    this.homePageInterface = new DummyHome();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // Navigate to entry list and hand over department
  pushList(department: String) {
    this.navCtrl.push(EntryListPage, {
      department: department
    })
  }
}
