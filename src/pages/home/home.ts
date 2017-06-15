import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { HomePageInterface } from "./home-interface";
import { DummyHome } from "./dummy-home";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // access interface implementation
  private homePageInterface: HomePageInterface;

  // filter preferences of user
  private filter: Array<boolean>;

  // resolver object
  private departmentResolver: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController) {
    // instantiate model object for interaction
    this.homePageInterface = new DummyHome();

    // instantiate user filter preferences
    this.filter = this.homePageInterface.getFilter();

    // instantiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // Navigate to entry list and hand over department
  pushList(departmentId?: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    });
  }

  // Navigate to entry list and open searchbar
  pushSearch() {
    this.navCtrl.push("EntryListPage", {
      searchbarFocus: true
    });
  }

}
