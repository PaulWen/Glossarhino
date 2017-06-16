import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, PopoverController } from 'ionic-angular';
import { DummySingleEntry } from "./dummy-class-single-entry";
import { SingleEntryInterface } from "./single-entry-interface";
import { Attachment } from "../../providers/model/attachment-model";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { Entry } from "../../providers/model/entry-model";

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController) {
    // get navParams
    this.name = this.navParams.get("name");

    // instantiate model object for interaction
    this.singleEntryInterface = new DummySingleEntry();

    // instantiate entry object
    this.entry = this.singleEntryInterface.getEntry(this.name);

    // instantiate user filter preferences
    this.filter = this.singleEntryInterface.getFilter();

    // instatiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * Method to send an email to the contact specified for the entry and department
   * @param emailAddress 
   */
  private sendMail(emailAddress: String) {
    //window.location.href = "mailto:" + emailAddress;
    window.open("mailto:" + emailAddress, "_system")
  };

  /**
   * Method to create and open the AttachmentModal to show list of attachments. AttachmentModalPage is the template for the modal.
   * @param attachments 
   */
  private openAttachmentModal(attachments: Array<Attachment>) {
    let attachmentModal = this.modalCtrl.create("AttachmentModalPage", {
      attachments: attachments
    });
    attachmentModal.present();
  };

  /**
   * navigate to entry list and open searchbar
   */
  private pushSearch() {
    this.navCtrl.push("EntryListPage", {
      searchbarFocus: true
    });
  };

  /**
   * create and present LanguagePopover to enable changing languages
   * @param event 
   */
  private presentLanguagePopover(event: any) {
    let popover = this.popoverCtrl.create("LanguagePopoverPage");
    popover.present({
      ev: event
    });
  };

  /**
   * create and present ActionSheet to show more actions for the user
   */
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
        }, {
          text: 'Filter',
          handler: () => {
            console.log('Filter clicked');
            this.openFilterModal();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  };

  /**
   * create and present the SettingsModal to show settings for the user. SettingsPage is the template for the modal.
   */
  private openFilterModal() {
    let filterModal = this.modalCtrl.create("FilterModalPage");
    filterModal.present();
  }

  /**
   * create and present the EditModal to show settings for the user. EditPage is the template for the modal.
   */
  private openEditModal(entry: Entry) {
    let editModal = this.modalCtrl.create("EditModalPage", {
      entry: entry
    });
    editModal.present();
  }
};
