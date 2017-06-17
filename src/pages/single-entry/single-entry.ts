import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { DummySingleEntry } from "./dummy-class-single-entry";
import { SingleEntryInterface } from "./single-entry-interface";
import { Attachment } from "../../providers/model/attachment-model";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { Entry } from "../../providers/model/entry-model";
import {Promise} from "es6-promise";
import {AppModelService} from "../../providers/model/app-model-service";

@IonicPage()
@Component({
  selector: 'page-single-entry',
  templateUrl: 'single-entry.html',
})
export class SingleEntryPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private name: String;

  // access interface implementation
  private singleEntryInterface: SingleEntryInterface;

  // entry object
  private entry: Entry;

  // filter preferences of user
  private filter: Array<boolean>;

  // resolver object
  private departmentResolver: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, appModel: AppModelService) {
    // get navParams
    this.name = this.navParams.get("name");

    // instantiate model object for interaction
    this.singleEntryInterface = appModel;

    // instantiate entry object
    this.entry = this.singleEntryInterface.getEntry(this.name);

    // instantiate user filter preferences
    this.filter = this.singleEntryInterface.getFilter();

    // instatiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.singleEntryInterface.isAuthenticated();
  }

  /**
   * Method to send an email to the contact specified for the entry and department
   * @param emailAddress
   */
  private sendMail(emailAddress: String) {
    //window.location.href = "mailto:" + emailAddress;
    window.open("mailto:" + emailAddress, "_system")
  }

  /**
   * Method to create and open the AttachmentModal to show list of attachments. AttachmentModalPage is the template for the modal.
   * @param attachments
   */
  private openAttachmentModal(attachments: Array<Attachment>) {
    let attachmentModal = this.modalCtrl.create("AttachmentModalPage", {
      attachments: attachments
    });
    attachmentModal.present().then((canEnterView)=>{
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage")
      }
    });
  }

  /**
   * Method to create and open the SettingsModal to show settings for the user. SettingsPage is the template for the modal.
   */
  private openFilterModal() {
    let filterModal = this.modalCtrl.create("FilterModalPage");
    filterModal.present().then((canEnterView)=>{
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage")
      }
    });
  }

  private openEditModal(entry: Entry) {
    let editModal = this.modalCtrl.create("EditModalPage", {
      entry: entry
    });
    editModal.present().then((canEnterView)=>{
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage")
      }
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'More Actions',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            console.log('Edit clicked');
            this.openEditModal(this.entry);
          }
        },{
          text: 'Filter',
          handler: () => {
            console.log('Filter clicked');
            this.openFilterModal();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


}
