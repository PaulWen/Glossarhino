import {Component, ViewChild} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  Searchbar,
  ViewController
} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppModelService} from "../../providers/app-model-service";
import {EntryListPageEntryDataObject} from "../../providers/dataobjects/entrylistpage.entry.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import {EntryListPageModelInterface} from "./entry-list.model-interface";

@IonicPage({
  segment: "entrylist/:departmentId",
  defaultHistory: ["HomePage"]
})
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
  private viewCtrl: ViewController;

  // navParams
  private departmentId: string;
  private searchbarFocus: boolean;

  // model object
  private appModelService: EntryListPageModelInterface;

  // data objects
  private entryList: Array<EntryListPageEntryDataObject>;
  private selectedLanguage: UserLanguageFilterConfigDataObject;

  // get access to seachbar itself
  @ViewChild("searchbar") searchbar: Searchbar;
  private searchbarIsHidden: boolean;
  private searchText: string;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, popoverCtrl: PopoverController, viewCtrl: ViewController, appModelService: AppModelService) {

    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.popoverCtrl = popoverCtrl;
    this.viewCtrl = viewCtrl;

    // get navParams
    this.departmentId = this.navParams.get("departmentId");
    this.searchbarFocus = this.navParams.get("searchbarFocus");

    // instantiate model
    this.appModelService = appModelService;

    // set default value
    this.searchbarIsHidden = true;

  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  private ionViewWillEnter() {
    // show searchbar after animation
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
    // hide searchbar before animation
    this.searchbarIsHidden = true;
  }

  //////////////////////////////////////////
  //            Page Functions            //
  //////////////////////////////////////////

  private loadData(departmendId?: string, refresher?) {
    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

      // load other data as soon as language loaded
      // get entryname list
      this.appModelService.getEntryListPageEntryDataObjects(this.searchText, this.selectedLanguage.selectedLanguage, departmendId).then((data) => {
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
    this.loadData(this.departmentId ? this.departmentId : undefined, refresher);
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  // Navigation method for single entry
  private pushEntry(entryDocumentId: string) {
    this.navCtrl.push("SingleEntryPage", {
      entryDocumentId: entryDocumentId
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
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

  private closeEntryListModal() {
    this.viewCtrl.dismiss();
  }
}
