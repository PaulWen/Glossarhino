import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Searchbar, PopoverController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { EntryListPageModelInterface } from "./entry-list.model-interface";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";
import { EntryListPageEntryDataObject } from "../../providers/dataobjects/entrylistpage.entry.dataobject";

@IonicPage()
@Component({
  selector: "page-entry-list",
  templateUrl: "entry-list.html"
})
export class EntryListPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private popoverCtrl: PopoverController;

  // navParams
  private departmentId: number;
  private searchbarFocus: boolean;

  // model objects
  private entryListPageModelInterface: EntryListPageModelInterface;
  private entryList: Array<EntryListPageEntryDataObject>;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

  // searchText from searchbar
  private searchText: string;

  // get access to seachbar itself
  @ViewChild("searchbar") searchbar: Searchbar;
  private searchbarIsHidden: boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, popoverCtrl: PopoverController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.popoverCtrl = popoverCtrl;

    // get navParams
    this.departmentId = this.navParams.get("departmentId");
    this.searchbarFocus = this.navParams.get("searchbarFocus");

    // instantiate model
    this.entryListPageModelInterface = appModel;

    this.searchbarIsHidden = true;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.entryListPageModelInterface.isAuthenticated();
  }

  private ionViewWillEnter() {
    // show searchbar
    this.searchbarIsHidden = false;

    // load data
    this.loadData(this.departmentId);
  }

  private ionViewDidEnter() {
    // set focus on searchbar
    if (this.searchbarFocus) {
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 50);
    }
  }

  private ionViewWillLeave() {
    // hide searchbar
    this.searchbarIsHidden = true;
  }

  /**
   * PAGE METHODS
   */
  private loadData(departmendId?: number, refresher?) {
    // get selected language
    this.entryListPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // load other data as soon as language loaded
      // get entryname list
      this.entryListPageModelInterface.getEntryNameList(this.searchText, this.selectedLanguageDataObject.selectedLanguage, departmendId).then((data) => {
        this.entryList = data;
      }, (error) => {
        Logger.log("Loading entry list failed (Class: EntryListPage, Method: loadData()");
        Logger.error(error);
      });

      // reset refresher if handed over in method
      if (refresher) {
        refresher.complete();
      }

    }, (error) => {
      Logger.log("Loading selected language failed (Class: EntryListPage, Method: loadData()");
      Logger.error(error);
    });
  }

  private doRefresh(refresher) {
    this.loadData(this.departmentId, refresher);
  }

  /**
   * NAVIGATION METHODS
   */
  // Navigation method for single entry
  private pushEntry(_id: string) {
    this.navCtrl.push("SingleEntryPage", {
      _id: _id
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

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
        popover.onWillDismiss(() => {
            this.loadData();
        })
    }
}
