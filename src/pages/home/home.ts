import { Component } from "@angular/core";
import { IonicPage, NavController, PopoverController, ActionSheetController, AlertController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { SuperLoginClientError } from "../../providers/super_login_client/super_login_client_error";
import { HomePageDepartmentDataobject } from "../../providers/dataobjects/homepage.department.dataobject"
import { HomePageModelInterface } from "./home.model-interface";
import { Logger } from "../../app/logger";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";
import { Alerts } from "../../app/alerts";

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

    // model service object
    private appModelService: HomePageModelInterface;

    // dataobjects
    private selectedDepartments: Array<HomePageDepartmentDataobject>;
    private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;
    private numberOfAllEntries: number;

    // selectFilterAlert objects
    private showDepartmentFilterAlertAppModel;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////

    constructor(navCtrl: NavController, popoverCtrl: PopoverController, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController, appModelService: AppModelService) {
        // instantiate ionic injected components
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;

        // instantiate model service object
        this.appModelService = appModelService;
        this.showDepartmentFilterAlertAppModel = appModelService;
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
        return this.appModelService.isAuthenticated();
    }

    //////////////////////////////////////////
    //            Page Functions            //
    //////////////////////////////////////////

    private loadData(refresher?) {
        // get selected language
        this.appModelService.getSelectedLanguage().then((data) => {
            this.selectedLanguageDataObject = data;

            // load other data as soon as language loaded
            this.appModelService.getCountOfAllEntries(this.selectedLanguageDataObject.selectedLanguage).then((data) => {
                this.numberOfAllEntries = data;
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

    private doRefresh(refresher) {
        this.loadData(refresher);
    }

    //////////////////////////////////////////
    //         Navigation Functions         //
    //////////////////////////////////////////

    private presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: "More Actions",
            buttons: [
                {
                    text: "New Entry",
                    handler: () => {
                        this.pushNewEntry();
                    }
                }, {
                    text: "Filter",
                    handler: () => {
                        this.showDepartmentFilterAlert(this.alertCtrl, this.showDepartmentFilterAlertAppModel);
                    }
                }, {
                    text: "Logout",
                    handler: () => {
                        this.logout();
                    }
                }, {
                    text: "Cancel",
                    role: "cancel"
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
            // reload data when popover is dismissed
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

    private showDepartmentFilterAlert(alertCtrl: AlertController, appModelService: AppModelService) {
        Alerts.showDepartmentFilterAlert(alertCtrl, appModelService).then(() => {
            this.loadData();
        }, (error) => {
            Logger.error(error);
        });
    }

    private logout() {
        this.appModelService.logout(() => {
            // successfully loged-out
            this.navCtrl.setRoot("LoginPage");

        }, (error: SuperLoginClientError) => {
            alert(error.getErrorMessage());
        });
    }

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
