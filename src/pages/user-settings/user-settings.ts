import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { UserSettingsPageModelInterface } from "./user-settings.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";
import { Logger } from "../../app/logger";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private popoverCtrl: PopoverController;
  private viewCtrl: ViewController;

  // model object
  private userSettingsPageModelInterface: UserSettingsPageModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;
  private userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject;

  // other objects
  private userDepartmentFilterCheckboxObject: Array<{ department: DepartmentDataObject, checked: boolean }>;
  private isModal: boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, popoverCtrl: PopoverController, viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.popoverCtrl = popoverCtrl;
    this.viewCtrl = viewCtrl;

    // instantiate model object
    this.userSettingsPageModelInterface = appModel;

    // get to know whether it is a modal
    this.isModal = this.navParams.get("isModal");
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
 
  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////
  
  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.userSettingsPageModelInterface.isAuthenticated();
  };

  private ionViewWillEnter() {
    // load data
    this.loadData();
  };

  private ionViewWillLeave() {
    this.updateModel();
  }

  /**
   * PAGE METHODS
   */
  private loadData() {
    // load global department config
    this.globalDepartmentConfigDataObject = this.userSettingsPageModelInterface.getGlobalDepartmentConfigDataObject();

    // load user department preferences
    this.userSettingsPageModelInterface.getUserDepartmentFilterConfigDataObject().then((data) => {
      this.userDepartmentFilterConfigDataObject = data;

      // put global config and user config together to fit to form
      this.userDepartmentFilterCheckboxObject = []; // instantiate object
      this.globalDepartmentConfigDataObject.departments.forEach(department => {
        if (this.userDepartmentFilterConfigDataObject.selectedDepartments.find(selectedDepartment => selectedDepartment == department.departmentId) == undefined) {
          this.userDepartmentFilterCheckboxObject.push({
            department: department,
            checked: false
          });
        } else {
          this.userDepartmentFilterCheckboxObject.push({
            department: department,
            checked: true
          });
        }
      });

    }, (error) => {
      Logger.log("Loading user department preferences failed (Class: UserSettingsPage, Method: loadData()");
      Logger.error(error);
    });
  };

  /**
   * transform globalDepartmentConfigDataObject to array of numbers to set it in model afterwards
   */
  get selectedDepartmentIds() {
    if (this.userDepartmentFilterCheckboxObject) {
      return this.userDepartmentFilterCheckboxObject.filter(department => department.checked).map(department => department.department.departmentId);
    };
  };

  /**
   * Update model to reflect new UserDepartmentFilterConfigDataObject
   * @param selectedDepartmentIds 
   */
  private updateModel() {
    // update array to reflect new settings
    this.userDepartmentFilterConfigDataObject.selectedDepartments = this.selectedDepartmentIds;

    // update model
    this.userSettingsPageModelInterface.setUserDepartmentFilterConfigDataObject(this.userDepartmentFilterConfigDataObject).then((data) => {
      Logger.log("Successfully set UserDepartmentFilterConfigDataObject (Class: UserSettingsPage, Method: updateModel()");
      Logger.log(data);
    }, (error) => {
      Logger.log("Setting UserDepartmentFilterConfigDataObject not successfull (Class: UserSettingsPage, Method: updateModel()");
      Logger.error(error);
    });
  };

  /**
   * NAVIGATION METHODS
   */

  /**
   * Method to close the FilterModal when pressing the assigned button
   */
  private closeUserSettingsModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * navigate to entry list and open searchbar
   */
  private pushSearch() {
    this.navCtrl.push("EntryListPage", {
      searchbarFocus: true
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
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
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }
}