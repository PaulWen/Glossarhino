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

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController) {
    // instantiate model object for interaction
    this.homePageInterface = new DummyHome();

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // Navigate to entry list and hand over department
  pushList(departmentId: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    })
  }

}
