import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePageInterface } from "./home-interface";
import { DummyHome } from "./dummy-home";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // searchbar toggle
  public searchbarToggled: boolean;

  // access interface implementation
  private homePageInterface: HomePageInterface;

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController) {
    // set default value
    this.searchbarToggled = false;

    // instantiate model object for interaction
    this.homePageInterface = new DummyHome();

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();
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

  // Navigate to entry list and hand over department
  pushList(departmentId: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    })
  }

}
