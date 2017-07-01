import { Component } from "@angular/core";
import { Promise } from "es6-promise";
import {
  ActionSheetController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  AlertController
} from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { SingleEntryPageModelInterface } from "./single-entry.model-interface";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";
import { CommentDataObject } from "../../providers/dataobjects/comment.dataobject";
import { Alerts } from "../../app/alerts";

@IonicPage({
  segment: "singleentry/:entryDocumentId",
  defaultHistory: ["HomePage", "EntryListPage"]
})
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
  private alertCtrl: AlertController;

  // navParams
  private entryDocumentId: string;

  // model object
  private appModelService: SingleEntryPageModelInterface;

  // data objects
  private entry: EntryDataObject;
  private selectedLanguage: UserLanguageFilterConfigDataObject;

  // selectFilterAlert objects
  private showDepartmentFilterAlertAppModel;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, modalCtrl: ModalController, actionSheetCtrl: ActionSheetController, popoverCtrl: PopoverController, alertCtrl: AlertController, appModelService: AppModelService) {

    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.modalCtrl = modalCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.popoverCtrl = popoverCtrl;
    this.alertCtrl = alertCtrl;

    // get navParams
    this.entryDocumentId = this.navParams.get("entryDocumentId");

    // instantiate model
    this.appModelService = appModelService;
    this.showDepartmentFilterAlertAppModel = appModelService;

  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  private ionViewWillEnter() {
    this.loadData();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData(refresher?) {
    //get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

      // load other data as soon as language loaded
      // get EntryDataObject
      this.appModelService.getEntryDataObject(this.entryDocumentId, this.selectedLanguage.selectedLanguage).then((data) => {
        this.entry = data;
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

  private sendMail(emailAddress: string) {
    window.open("mailto:" + emailAddress, "_system");
  }

  private getArrayLength(array: Array<any>): number {
    if (array == undefined) {
      return 0;
    } else {
      return array.length;
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "More Actions",
      buttons: [
        {
          text: "Edit",
          handler: () => {
            Logger.log("Edit clicked");
            this.openEditModal(this.entry._id);
          }
        }, {
          text: "Filter",
          handler: () => {
            this.showDepartmentFilterAlert(this.alertCtrl, this.showDepartmentFilterAlertAppModel);
          }
        }, {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            Logger.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

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
    popover.onWillDismiss(() => {
      this.loadData();
    })
  }

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
  }

  private showDepartmentFilterAlert(alertCtrl: AlertController, appModelService: AppModelService) {
    Alerts.showDepartmentFilterAlert(alertCtrl, appModelService).then(() => {
      this.loadData();
    }, (error) => {
      Logger.error(error);
    });
  }

  private openCommentModal(entry: EntryDataObject) {
    let commentModal = this.modalCtrl.create("CommentModalPage", {
      entry: entry
    });
    commentModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

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
  }

  private openLinkedObjectsModal(relatedDepartments: Array<number>, relatedEntries: Array <string>, synonyms: Array<string>, acronyms: Array<string>) {
    let linkedObjectsModal = this.modalCtrl.create("LinkedObjectsModalPage", {
      relatedDepartments: relatedDepartments,
      relatedEntries: relatedEntries,
      synonyms: synonyms,
      acronyms: acronyms
    });
    linkedObjectsModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  private openAttachment(url: string) {
    //window.location.href = url.href;
    window.open(url, "_system");
  }

}