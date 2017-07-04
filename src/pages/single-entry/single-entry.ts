import { Component, ViewChild } from "@angular/core";
import { Promise } from "es6-promise";
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  LoadingController
} from "ionic-angular";
import { Alerts } from "../../app/alerts";
import { Logger } from "../../app/logger";
import { AppModelService } from "../../providers/app-model-service";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { SingleEntryPageModelInterface } from "./single-entry.model-interface";
import { DepartmentFilterComponent } from "../../components/department-filter/department-filter";

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
  private loadingCtrl: LoadingController;

  // navParams
  private entryDocumentId: string;

  // model object
  private appModelService: SingleEntryPageModelInterface;

  // data objects
  private entry: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  // department filter
  @ViewChild(DepartmentFilterComponent) departmentFilterComponent: DepartmentFilterComponent;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, modalCtrl: ModalController, actionSheetCtrl: ActionSheetController, popoverCtrl: PopoverController, alertCtrl: AlertController, loadingCtrl: LoadingController, appModelService: AppModelService) {

    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.modalCtrl = modalCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.popoverCtrl = popoverCtrl;
    this.alertCtrl = alertCtrl;
    this.loadingCtrl = loadingCtrl;

    // get navParams
    this.entryDocumentId = this.navParams.get("entryDocumentId");

    // instantiate model
    this.appModelService = appModelService;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> {
    return this.appModelService.isAuthenticated(this.loadingCtrl);
  }

  private ionViewWillEnter() {
    this.loadData();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  /**
   * Function loads data for the page, at first the selectedLanguageDataObject, because it is needed for other data to be loaded.
   * @param refresher optional parameter, hand over, if reload triggered from "pull-to-refresh"
   */
  private loadData(refresher?) {
    //get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // load other data as soon as language loaded
      // get EntryDataObject
      this.appModelService.getEntryDataObjectToShow(this.entryDocumentId, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.entry = data;
      }, (error) => {
        switch (error.status) {
          case 404:
            this.showNoEntryAlert();

          default:
            Logger.log("Loading Entry Data Object failed (Class: SingleEntryPage, Method: loadData()");
            Logger.error(error);
        }
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

  /**
   * Returns the length of an array and 0 if array is undefined.
   * @param array Array to return the length from.
   */  
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
            this.departmentFilterComponent.showAlert().then(() => {
              this.loadData();
            });
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
    });
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
      attachments: attachments,
      isEditMode: false
    });
    attachmentModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  private openLinkedObjectsModal(relatedDepartments: Array<string>, relatedEntries: Array<string>, synonyms: Array<string>, acronyms: Array<string>) {
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

  private showNoEntryAlert() {
    Logger.log(this.entryDocumentId);
    Logger.log(this.selectedLanguageDataObject.selectedLanguage);

    
    Alerts.showNoEntryAlert(this.alertCtrl, this.navCtrl, this.entryDocumentId, this.selectedLanguageDataObject.selectedLanguage);
  }

}
