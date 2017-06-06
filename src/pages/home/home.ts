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
  // access interface implementation
  private homePageInterface: HomePageInterface;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController) {
    // instantiate model object for interaction
    this.homePageInterface = new DummyHome();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // Navigate to entry list and hand over department
  pushList(departmentId: number) {
    this.navCtrl.push(EntryListPage, {
      departmentId: departmentId
    })
  }
}
