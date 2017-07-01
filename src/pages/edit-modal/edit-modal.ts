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
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";

@IonicPage()
@Component({
  selector: "page-edit-modal",
  templateUrl: "edit-modal.html"
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
  private appModelService: EditModalPageModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;
  private entry: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, modalCtrl: ModalController, alertCtrl: AlertController, appModelService: AppModelService) {
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
    this.appModelService = appModelService;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewDidLoad() {
    this.loadData();
  }

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData(refresher?) {
    // load global department config
    this.globalDepartmentConfigDataObject = this.appModelService.getGlobalDepartmentConfigDataObject();

    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      //load other data as soon as language loaded
      // get EntryDataObject
      if (this.addNewEntry) {
        this.entry = EntryDataObject.init();
      } else {
        this.appModelService.getCompleteEntryDataObject(this._id, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
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

  private doRefresh(refresher) {
    this.loadData(refresher);
  }

  private addDepartmentSpecification(departmentId: string) {
    this.entry.departmentSpecifics.push(DepartmentEntrySpecificsDataObject.init(departmentId));
  }

  private removeDepartmentSpecification(departmentId: string) {
    let index: number = this.entry.departmentSpecifics.findIndex(departmentSpecifics => departmentSpecifics.departmentId == departmentId);
    if (index > -1) {
      this.entry.departmentSpecifics.splice(index, 1);
    }
  }

  private removeEntryDataObject(entryDataObject: EntryDataObject, languageId: string) {
    this.appModelService.removeEntryDataObject(entryDataObject, languageId).then((data) => {
      Logger.log(data);
    }, (error) => {
      Logger.error(error);
    });
    this.navCtrl.setRoot("HomePage");
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeEditModal(save: boolean) {
    if (save) {
      this.entry.departmentSpecifics.sort(DepartmentEntrySpecificsDataObject.compare);
      if (this.addNewEntry) {
        this.appModelService.newEntryDataObject(this.entry, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
          this.viewCtrl.dismiss();

        });
      } else {
        this.appModelService.setEntryDataObject(this.entry, this.selectedLanguageDataObject.selectedLanguage).then(() => {
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
        this.addDepartmentSpecification(data);
      }
    });
    departmentRadioAlert.present();
  }

  private openAttachmentModal(attachments: Array<AttachmentDataObject>) {
    let attachmentModal = this.modalCtrl.create("AttachmentModalPage", {
      attachments: attachments,
      isEditMode: true
    });
    attachmentModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
    attachmentModal.onDidDismiss((data) => {
      this.entry.attachments = data.attachments;
    });
  }

  private openLinkedObjectsModal(relatedDepartments: Array<string>, relatedEntries: Array<string>, synonyms: Array<string>, acronyms: Array<string>) {
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
      // set linkedObjects in object
      this.entry.relatedDepartments = data.relatedDepartments;
      this.entry.relatedEntries = data.relatedEntries;
      this.entry.synonyms = data.synonyms;
      this.entry.acronyms = data.acronyms;
    });
  }
}
