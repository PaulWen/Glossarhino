import {Component} from "@angular/core";
import {Promise} from "es6-promise";
import {
  ActionSheetController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import {AppModelService} from "../../providers/app-model-service";
import {AttachmentDataobject} from "../../providers/dataobjects/attachment.dataobject";
import {EntryDataobject} from "../../providers/dataobjects/entry.dataobject";
import {SingleEntryInterface} from "./single-entry-interface";

@IonicPage()
@Component({
  selector: "page-single-entry",
  templateUrl: "single-entry.html"
})
export class SingleEntryPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private name: String;

  // access interface implementation
  private singleEntryInterface: SingleEntryInterface;

  // entry object
  private entry: EntryDataobject;

  // filter preferences of user
  private filter: Array<boolean>;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController, appModel: AppModelService) {
    // get navParams
    this.name = this.navParams.get("name");

    // instantiate model object for interaction
    this.singleEntryInterface = appModel;

    // instantiate entry object
    this.entry = this.singleEntryInterface.getEntry(this.name);

    // instantiate user filter preferences
    this.filter = this.singleEntryInterface.getFilter();
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
    window.open("mailto:" + emailAddress, "_system");
  };

  /**
   * Method to create and open the AttachmentModal to show list of attachments. AttachmentModalPage is the template for the modal.
   * @param attachments
   */
  private openAttachmentModal(attachments: Array<AttachmentDataobject>) {
    let attachmentModal = this.modalCtrl.create("AttachmentModalPage", {
      attachments: attachments
    });
    attachmentModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
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
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  };

  /**
   * create and present ActionSheet to show more actions for the user
   */
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "More Actions",
      buttons: [
        {
          text: "Edit",
          handler: () => {
            console.log("Edit clicked");
            this.openEditModal(this.entry);
          }
        }, {
          text: "Filter",
          handler: () => {
            console.log("Filter clicked");
            this.openFilterModal();
          }
        }, {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
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
    filterModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  };

  /**
   * create and present the EditModal to show settings for the user. EditPage is the template for the modal.
   */
  private openEditModal(entry: EntryDataobject) {
    let editModal = this.modalCtrl.create("EditModalPage", {
      entry: entry
    });
    editModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  };
}
;
