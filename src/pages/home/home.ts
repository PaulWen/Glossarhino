import {Component} from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  NavController,
  PopoverController,
  LoadingController
} from "ionic-angular";
import {Alerts} from "../../app/alerts";
import {Logger} from "../../app/logger";
import {AppModelService} from "../../providers/app-model-service";
import {HomePageDepartmentDataobject} from "../../providers/dataobjects/homepage.department.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import {SuperLoginClientError} from "../../providers/super_login_client/super_login_client_error";
import {HomePageModelInterface} from "./home.model-interface";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private popoverCtrl: PopoverController;
  private actionSheetCtrl: ActionSheetController;
  private alertCtrl: AlertController;
  private loadingCtrl: LoadingController;

  // model service object
  private appModelService: HomePageModelInterface;
  private showDepartmentFilterAlertAppModelService;

  // dataobjects
  private selectedDepartments: Array<HomePageDepartmentDataobject>;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;
  private countOfAllEntries: number;

  // other
  private translateService: TranslateService;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(navCtrl: NavController, popoverCtrl: PopoverController, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController, loadingCtrl: LoadingController, appModelService: AppModelService, translateService: TranslateService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.popoverCtrl = popoverCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.alertCtrl = alertCtrl;
    this.loadingCtrl = loadingCtrl;

    // instantiate model service object
    this.appModelService = appModelService;
    this.showDepartmentFilterAlertAppModelService = appModelService;

    // other
    this.translateService = translateService;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewWillEnter() {
    this.loadData();
  }

  private ionViewCanEnter(): Promise<boolean> {
    // check authentication
    return this.appModelService.isAuthenticated(this.loadingCtrl);
  }

  //////////////////////////////////////////
  //            Page Functions            //
  //////////////////////////////////////////

  /**
   * Function loads data for the page, at first the selectedLanguageDataObject, because it is needed for other data to be loaded. After the selectedLanguageDataObject is loaded, the countOfAllEntries
   * @param refresher optional parameter, hand over, if reload triggered from "pull-to-refresh"
   */
  private loadData(refresher?) {
    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // load other data as soon as language loaded
      // load countOfAllEntries for first card
      this.appModelService.getCountOfAllEntries(this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.countOfAllEntries = data;
      }, (error) => {
        Logger.log("Loading all listings failed (Class: HomePage, Method: loadData()");
        Logger.error(error);
      });

      // load selected departments
      this.appModelService.getSelectedHomePageDepartmentDataobjects(this.selectedLanguageDataObject.selectedLanguage).then((data) => {
        this.selectedDepartments = data;
      }, (error) => {
        Logger.log("Loading selected departments failed (Class: HomePage, Method: loadData()");
        Logger.error(error);
      });

      // reset refresher if handed over in method
      if (refresher) {
        refresher.complete();
      }

    }, (error) => {
      Logger.log("Loading currentLanguage failed (Class: HomePage, Method: loadData()");
      Logger.error(error);
    });
  }

  /**
   * Function refreshes the data from the Model and is triggered by "pull-down" of content
   * @param refresher Refresher is handed over, to reset it once the refresh is complete.
   */
  private doRefresh(refresher) {
    this.loadData(refresher);
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  /**
   * Presents an ActionSheet to consolidate more possible actions
   */
  private presentActionSheet() {
    Observable.zip(
      this.translateService.get("MORE_ACTIONS"),
      this.translateService.get("NEW_ENTRY"),
      this.translateService.get("FILTER"),
      this.translateService.get("LOGOUT"),
      this.translateService.get("CANCEL"),
      (moreActions: string, newEntry: string, filter: string, logout: string, cancel: string) => {
        return this.actionSheetCtrl.create({
          title: moreActions,
          buttons: [
            {
              text: newEntry,
              handler: () => {
                this.pushNewEntry();
              }
            }, {
              text: filter,
              handler: () => {
                this.showDepartmentFilterAlert(this.alertCtrl, this.showDepartmentFilterAlertAppModelService);
              }
            }, {
              text: logout,
              handler: () => {
                this.logout();
              }
            }, {
              text: cancel,
              role: "cancel"
            }
          ]
        });
      }
    ).subscribe((alert)=>{
      alert.present();
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
      // reload data when popover is dismissed
      this.loadData();
    });
  }

  /**
   * Function to go to search view of EntryListPage
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
  }

  /**
   * Function to go to new entry view of EditModalpage
   */
  private pushNewEntry() {
    this.navCtrl.push("EditModalPage", {
      addNewEntry: true
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  /**
   * Shows a filter alert for departments
   * @param alertCtrl Hand over AlertController of the page to show an alert on that page
   * @param appModelService Hand over AppModelService to be able to load current preferences and all available departments
   */
  private showDepartmentFilterAlert(alertCtrl: AlertController, appModelService: AppModelService) {
    Alerts.showDepartmentFilterAlert(alertCtrl, appModelService, this.translateService).then(() => {
      this.loadData();
    }, (error) => {
      Logger.error(error);
    });
  }

  private logout() {
    // open loading dialog since this may take a while
    let loadingAlert = Alerts.presentLoadingDefault(this.loadingCtrl, this.translateService);

    this.appModelService.logout(() => {
      // successfully loged-out
      this.navCtrl.setRoot("LoginPage");

      // close loading dialog
      loadingAlert.dismiss();

    }, (error: SuperLoginClientError) => {
      // close loading dialog
      loadingAlert.dismiss();

      alert(error.getErrorMessage());
    });
  }

  /**
   * Open list of entries for the selected department…
   * @param departmentId Optional, hand over undefined, if user selected "all"
   */
  private pushEntryListPage(departmentId?: string) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

}
