import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EditModalPageModelInterface } from "./edit-modal.model-interface";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { AppModelService } from "../../providers/app-model-service";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";

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

  // navParams
  private _id: string;

  // model object
  private editModalPageModelInterface: EditModalPageModelInterface;

  // data objects
  private entryDataObject: EntryDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

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

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeEditModal(save: boolean) {
    console.log(this.entryDataObject);
    if (save) {
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
}
