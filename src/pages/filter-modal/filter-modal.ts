import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FilterModalInterface } from "./filter-modal-interface";
import { DummyFilterModal } from "./dummy-class-filter-modal";
import { Logger } from "../../app/logger";
import {AppModelService} from "../../providers/model/app-model-service";
import {Promise} from "es6-promise";

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

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate model object for interaction
    this.filterModalInterface = appModel;

    // load settings from the model
    this.filterSettings = this.filterModalInterface.getFilter();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.filterModalInterface.isAuthenticated();
  }


  /**
   * Method to close the FilterModal when pressing the assigned button
   */
  private closeFilterModal() {
    this.viewCtrl.dismiss();
  }
}
