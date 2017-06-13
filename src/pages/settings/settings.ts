import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPageInterface } from "./settings-interface";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { DummySettings } from "./dummy-settings";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // access interface implementation
  private settingsPageInterface: SettingsPageInterface;

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  // array to save inputs for saving them later on
  private checkedDepartments: Array<boolean> = [];

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // instantiate model object for interaction
    this.settingsPageInterface = new DummySettings();

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();

  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // method to handle changes on checkboxes
  private updatePreferences(departmentId: number, index: number) {
    Logger.log("Department ID: " + departmentId + " Index: " + index)
    Logger.log("Value: " + this.checkedDepartments[index]);
    this.settingsPageInterface.setPreferences(departmentId, this.checkedDepartments[index]);
  }

}
