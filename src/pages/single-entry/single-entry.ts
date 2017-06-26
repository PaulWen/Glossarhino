import { Component } from "@angular/core";
import { Promise } from "es6-promise";
import {
  ActionSheetController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { SingleEntryPageModelInterface } from "./single-entry.model-interface";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: "page-single-entry",
  templateUrl: "single-entry.html"
})
export class SingleEntryPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private modalCtrl: ModalController;
  private actionSheetCtrl: ActionSheetController;
  private popoverCtrl: PopoverController;

  // navParams
  private _id: string;

  // model object
  private singleEntryPageModelInterface: SingleEntryPageModelInterface;
  
  // data objects
  private entryDataObject: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, modalCtrl: ModalController, actionSheetCtrl: ActionSheetController, popoverCtrl: PopoverController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.modalCtrl = modalCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.popoverCtrl = popoverCtrl;

    // get navParams
    this._id = this.navParams.get("_id");

    // instantiate model
    this.singleEntryPageModelInterface = appModel;
  };

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  
  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewWillEnter() {
    // load data
    this.loadData();
  };

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.singleEntryPageModelInterface.isAuthenticated();
  };

  /**
   * PAGE METHODS
   */
  private loadData(refresher?) {
    //get selected language
    this.singleEntryPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // load other data as soon as language loaded
      // get EntryDataObject
      this.singleEntryPageModelInterface.getEntryDataObject(this._id, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.entryDataObject = data;
      }, (error) => {
        Logger.log("Loading Entry Data Object failed (Class: SingleEntryPage, Method: loadData()");
        Logger.error(error);
      });

      // reset refresher if handed over in method
      if (refresher) {
        refresher.complete();
      }

    }, (error) => {
      Logger.log("Loading selected language failed (Class: SingleEntryPage, Method: loadData()");
      Logger.error(error);
    });
  }

  private doRefresh(refresher) {
    this.loadData(refresher);
  }

  /**
   * Method to send an email to the contact specified for the entry and department
   * @param emailAddress
   */
  private sendMail(emailAddress: string) {
    window.open("mailto:" + emailAddress, "_system");
  };

  /**
   * NAVIGATION METHODS
   */
  /**
   * Method to create and open the AttachmentModal to show list of attachments. AttachmentModalPage is the template for the modal.
   * @param attachments
   */
  private openAttachmentModal(attachments: Array<AttachmentDataObject>) {
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
            this.openEditModal(this.entryDataObject._id);
          }
        }, {
          text: "Settings",
          handler: () => {
            console.log("Settings clicked");
            this.openUserSettingsPageModal();
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
  };

  /**
   * create and present the SettingsModal to show settings for the user. SettingsPage is the template for the modal.
   */
  private openUserSettingsPageModal() {
    let userSettingsPageModal = this.modalCtrl.create("UserSettingsPage", {
      isModal: true
    });
    userSettingsPageModal.onWillDismiss(() => {
      this.loadData();
    });
    userSettingsPageModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  };

  /**
   * create and present the EditModal to show settings for the user. EditPage is the template for the modal.
   */
  private openEditModal(_id: string) {
    let editModal = this.modalCtrl.create("EditModalPage", {
      _id: _id
    });
    editModal.onWillDismiss(() => {
      this.loadData();
    });
    editModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  };
}