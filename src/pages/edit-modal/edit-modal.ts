import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Entry } from "../../providers/model/entry-model";
import { EditModalInterface } from "./edit-modal-interface";
import { DummyEditModal } from "./dummy-class-edit-modal";
import { Logger } from "../../app/logger";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import {Promise} from "es6-promise";
import {AppModelService} from "../../providers/model/app-model-service";

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {
  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // navParams
  private entry: Entry;

  //access interface implementation
  private editModalInterface: EditModalInterface;

  // resolver object
  private departmentResolver: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, appModel: AppModelService) {
    // get navParams
    this.entry = this.navParams.get("entry");

    // instantiate model object for interaction
    this.editModalInterface = appModel;

    // instantiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.editModalInterface.isAuthenticated();
  }

  private closeEditModal(saveEntry: boolean) {
    if (saveEntry) {
      this.editModalInterface.setEntry(this.entry);
      Logger.log("Changes to entry saved.");
    }
    this.viewCtrl.dismiss();
  }
}