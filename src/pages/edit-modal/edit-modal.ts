import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { EditModalPageModelInterface } from "./edit-modal.model-interface";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { AppModelService } from "../../providers/app-model-service";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { DepartmentEntrySpecificsDataObject } from "../../providers/dataobjects/department-entry-description.dataobject";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;
  private alertCtrl: AlertController;

  // navParams
  private _id: string;

  // model object
  private editModalPageModelInterface: EditModalPageModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;
  private entryDataObject: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, alertCtrl: AlertController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;

    // get navParams
    this._id = this.navParams.get("_id");

    // instantiate model object
    this.editModalPageModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewDidLoad() {
    // load data
    this.loadData();
  }

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.editModalPageModelInterface.isAuthenticated();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  /**
   * load data for the page
   * @param refresher hand over to complete refresher once data is loaded
   */
  private loadData(refresher?) {
    // load global department config
    this.globalDepartmentConfigDataObject = this.editModalPageModelInterface.getGlobalDepartmentConfigDataObject();

    // get selected language
    this.editModalPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      //load other data as soon as language loaded
      // get EntryDataObject
      this.editModalPageModelInterface.getEntryDataObject(this._id, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.entryDataObject = data;
      }, (error) => {
        Logger.log("Loading Entry Data Object failed (Class: EditModalPage, Method: loadData()");
        Logger.error(error);
      });

      // reset refresher if handed over in method
      if (refresher) {
        refresher.complete();
      }

    }, (error) => {
      Logger.log("Loading Entry Data Object failed (Class: EditModalPage, Method: loadData()");
      Logger.error(error);
    });
  }

  /**
   * refresh page when on pulling content down
   * @param refresher 
   */
  private doRefresh(refresher) {
    this.loadData(refresher);
  }

  private addDepartmentSpecification(departmentId: number) {
    this.entryDataObject.departmentSpecifics.push(DepartmentEntrySpecificsDataObject.init(departmentId));
  }

  private removeDepartmentSpecification(departmentId: number) {
    let index: number = this.entryDataObject.departmentSpecifics.findIndex(departmentSpecifics => departmentSpecifics.departmentId == departmentId);
    if (index > -1) {
      this.entryDataObject.departmentSpecifics.splice(index, 1);
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeEditModal(save: boolean) {
    if (save) {
      this.entryDataObject.departmentSpecifics.sort((a, b) => {
        return a.departmentId - b.departmentId
      });
      this.editModalPageModelInterface.setEntryDataObject(this.entryDataObject, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.viewCtrl.dismiss();
      }, (error) => {
        Logger.log("Setting Entry Data Object failed (Class: EditModalPage, Method: closeEditModal()");
        Logger.error(error);
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }

  private showAddDepartmentRadioAlert() {
    let departmentRadioAlert = this.alertCtrl.create();
    departmentRadioAlert.setTitle('Select department');

    //check array of departments and remove the ones already included in the entryDataObject
    let temporaryArray: Array<DepartmentDataObject> = [];
    this.globalDepartmentConfigDataObject.departments.forEach(department => {
      if (this.entryDataObject.departmentSpecifics.find(departmentSpecifics => departmentSpecifics.departmentId == department.departmentId) == undefined) {
        temporaryArray.push(department);
      }
    });

    temporaryArray.forEach(department => {
      departmentRadioAlert.addInput({
        type: 'radio',
        label: department.departmentName,
        value: department.departmentId.toString()
      });
    });

    departmentRadioAlert.addButton('Cancel');
    departmentRadioAlert.addButton({
      text: 'OK',
      handler: data => {
        this.addDepartmentSpecification(+data);
      }
    });
    departmentRadioAlert.present();
  }
}
