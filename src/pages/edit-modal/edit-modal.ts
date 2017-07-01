import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
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
  private modalCtrl: ModalController;

  // navParams
  private _id: string;
  private addNewEntry: boolean;

  // model object
  private editModalPageModelInterface: EditModalPageModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;
  private entry: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, modalCtrl: ModalController, alertCtrl: AlertController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;
    this.modalCtrl = modalCtrl;

    // get navParams
    this._id = this.navParams.get("_id");
    this.addNewEntry = this.navParams.get("addNewEntry");

    // instantiate model object
    this.editModalPageModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewDidLoad() {
    this.loadData();
  }

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.editModalPageModelInterface.isAuthenticated();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData(refresher?) {
    // load global department config
    this.globalDepartmentConfigDataObject = this.editModalPageModelInterface.getGlobalDepartmentConfigDataObject();

    // get selected language
    this.editModalPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      //load other data as soon as language loaded
      // get EntryDataObject
      if (this.addNewEntry) {
        this.entry = EntryDataObject.init();
      } else {
        this.editModalPageModelInterface.getEntryDataObject(this._id, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
          this.entry = data;
        }, (error) => {
          Logger.log("Loading Entry Data Object failed (Class: EditModalPage, Method: loadData()");
          Logger.error(error);
        });
      }


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
    this.entry.departmentSpecifics.push(DepartmentEntrySpecificsDataObject.init(departmentId));
  }

  private removeDepartmentSpecification(departmentId: number) {
    let index: number = this.entry.departmentSpecifics.findIndex(departmentSpecifics => departmentSpecifics.departmentId == departmentId);
    if (index > -1) {
      this.entry.departmentSpecifics.splice(index, 1);
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeEditModal(save: boolean) {
    if (save) {
      this.entry.departmentSpecifics.sort((a, b) => {
        return a.departmentId - b.departmentId;
      });
      if (this.addNewEntry) {
        this.editModalPageModelInterface.newEntryDataObject(this.entry, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
          this.viewCtrl.dismiss();

        })
      } else {
        this.editModalPageModelInterface.setEntryDataObject(this.entry, this.selectedLanguageDataObject.selectedLanguage).then(() => {
          this.viewCtrl.dismiss();
        }, (error) => {
          Logger.log("Setting Entry Data Object failed (Class: EditModalPage, Method: closeEditModal()");
          Logger.error(error);
        });
      }

    } else {
      this.viewCtrl.dismiss();
    }
  }

  private showAddDepartmentRadioAlert() {
    let departmentRadioAlert = this.alertCtrl.create();
    departmentRadioAlert.setTitle("Select department");

    //check array of departments and remove the ones already included in the entryDataObject
    let temporaryArray: Array<DepartmentDataObject> = [];
    this.globalDepartmentConfigDataObject.departments.forEach(department => {
      if (this.entry.departmentSpecifics.find(departmentSpecifics => departmentSpecifics.departmentId == department.departmentId) == undefined) {
        temporaryArray.push(department);
      }
    });

    temporaryArray.forEach(department => {
      departmentRadioAlert.addInput({
        type: "radio",
        label: department.departmentName,
        value: department.departmentId.toString()
      });
    });

    departmentRadioAlert.addButton("Cancel");
    departmentRadioAlert.addButton({
      text: "OK",
      handler: data => {
        this.addDepartmentSpecification(+data);
      }
    });
    departmentRadioAlert.present();
  }

  private openLinkedObjectsModal(relatedDepartments: Array<number>, relatedEntries: Array<string>, synonyms: Array<string>, acronyms: Array<string>) {
    let linkedObjectsModal = this.modalCtrl.create("LinkedObjectsModalPage", {
      relatedDepartments: relatedDepartments,
      relatedEntries: relatedEntries,
      synonyms: synonyms,
      acronyms: acronyms,
      isEditMode: true
    });
    linkedObjectsModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
    linkedObjectsModal.onDidDismiss((data) => {
      // get relatedDepartments from model
      this.entry.relatedDepartments = data.relatedDepartments;
    });
  }

  private showSynonymsEditModal() {
    let synonymsEditModel = this.modalCtrl.create("EntryListPage", {
      isAddSynonymModal: true
    });
    synonymsEditModel.present();
  }
}
