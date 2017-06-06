import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DummyHome } from "./dummy-class-home";
import { HomePageInterface } from "./home-interface";
import { EntryListPage } from "../entry-list/entry-list";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
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
    this.navCtrl.push(EntryListPage, {
      departmentId: departmentId
    })
  }
}
