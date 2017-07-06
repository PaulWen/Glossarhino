import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SingleEntryPage } from "../single-entry/single-entry";
import { AttachmentModalPage } from "../attachment-modal/attachment-modal";
import { LinkedObjectsModalPage } from "../linked-objects-modal/linked-objects-modal";
import { AppModelService } from "../../providers/app-model-service";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";

@IonicPage({
  segment: "singleentrytabs/:entryDocumentId",
  defaultHistory: ["HomePage", "EntryListPage"]
})
@Component({
  selector: 'page-single-entry-tabs',
  templateUrl: 'single-entry-tabs.html',
})
export class SingleEntryTabsPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private loadingCtrl: LoadingController;
  private alertCtrl: AlertController;

  // navParams
  private entryDocumentId: string;

  // model object
  private appModelService: AppModelService;

  // data objects
  private entry: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  // tabs
  private singleEntryPage = "SingleEntryPage";

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, loadingCtrl: LoadingController, alertCtrl: AlertController, appModelService: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.loadingCtrl = loadingCtrl;
    this.alertCtrl = alertCtrl

    // get navParams
    this.entryDocumentId = this.navParams.get("entryDocumentId");

    // instantiate model object
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

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private showNoEntryAlert() {
    let alert = this.alertCtrl.create({
      title: "Entry not available!",
      subTitle: "Sorry, the entry is not yet available in this language.",
      buttons: ['OK']
    });
    alert.present();
    alert.onWillDismiss(() => {
      this.navCtrl.setRoot("HomePage");
    })
  }
}
