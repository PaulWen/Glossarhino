import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController } from 'ionic-angular';
import { HomePageInterface } from "./home-interface";
import { DummyHome } from "./dummy-home";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // model objects
  private homePageInterface: HomePageInterface;
  private departments: Array<number>;
  private filter: Array<boolean>;
  private language: String;

  // resolver object
  private departmentResolver: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
    // instantiate model objects
    this.homePageInterface = new DummyHome();
    this.departments = this.homePageInterface.getDepartments();
    this.filter = this.homePageInterface.getFilter();
    this.language = this.homePageInterface.getLanguage();

    // instantiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * navigate to entry list and hand over department
   * @param departmentId 
   */
  private pushList(departmentId?: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    });
  }

  /**
   * navigate to entry list and open searchbar
   */
  private pushSearch() {
    this.navCtrl.push("EntryListPage", {
      searchbarFocus: true
    });
  }

  /**
   * create and present LanguagePopover to enable changing languages
   * @param event 
   */
  private presentLanguagePopover(event: any) {
    let popover = this.popoverCtrl.create("LanguagePopoverPage");
    popover.present({
      ev: event
    });
  }

}
