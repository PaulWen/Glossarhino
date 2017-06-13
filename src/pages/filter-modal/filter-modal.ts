import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FilterModalInterface } from "./filter-modal-interface";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { DummyFilterModal } from "./dummy-class-filter-modal";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: 'page-filter-modal',
  templateUrl: 'filter-modal.html',
})
export class FilterModalPage {
  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // access interface implementation
  private filterModalInterface: FilterModalInterface;

  // Map to temp store the filter settings
  private filterSettings: Array<boolean>;

  // dummy resolver object
  private resolveDepartment: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    // instantiate model object for interaction
    this.filterModalInterface = new DummyFilterModal();

    // instantiate resolver object
    this.resolveDepartment = new DummyResolveDepartment();

    // load settings from the model
    this.filterSettings = this.filterModalInterface.getFilter();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * Method to close the FilterModal when pressing the assigned button
   */
  private closeFilterModal() {
    this.viewCtrl.dismiss();
  }
}
