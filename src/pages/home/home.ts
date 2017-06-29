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
    private selectedLanguage: UserLanguageFilterConfigDataObject;
    private numberOfAllEntries: number;

    // selectFilterAlert objects
    private globalDepartmentConfig: GlobalDepartmentConfigDataObject;
    private userDepartmentFilterConfig: UserDepartmentFilterConfigDataObject;
    private userDepartmentFilterCheckboxParsed: Array<{ details: DepartmentDataObject, checked: boolean }>;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////

    constructor(navCtrl: NavController, popoverCtrl: PopoverController, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController, appModelService: AppModelService) {
        // instantiate ionic injected components
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;

        // instantiate model service object
        this.appModelService = appModelService;
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
            this.selectedLanguage = data;

            // load other data as soon as language loaded
            this.appModelService.getCountOfAllEntries(this.selectedLanguage.selectedLanguage).then((data) => {
                this.numberOfAllEntries = data;
            }, (error) => {
                Logger.log("Loading all listings failed (Class: HomePage, Method: loadData()");
                Logger.error(error);
            });

            // load selected departments
            this.appModelService.getSelectedHomePageDepartmentDataobjects(this.selectedLanguage.selectedLanguage).then((data) => {
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

    private loadFilterData() {

        // load global departmentconfig
        this.globalDepartmentConfig = this.appModelService.getGlobalDepartmentConfigDataObject();

        // load user department filters
        this.appModelService.getUserDepartmentFilterConfigDataObject().then((data) => {
            this.userDepartmentFilterConfig = data;

            // put global config and user config together to fit form for UI
            this.userDepartmentFilterCheckboxParsed = [];

            this.globalDepartmentConfig.departments.forEach(department => {
                // check whether the department is already selected by the user, if not set false, if so set true
                if (this.userDepartmentFilterConfig.selectedDepartments.find(selectedDepartment => selectedDepartment == department.departmentId) == undefined) {
                    this.userDepartmentFilterCheckboxParsed.push({
                        details: department,
                        checked: false
                    });
                } else {
                    this.userDepartmentFilterCheckboxParsed.push({
                        details: department,
                        checked: true
                    });
                }
            });

            // show checkbox alert after loaded data
            this.showSelectFilterAlert();

        }, (error) => {
            Logger.log("Loading user department preferences failed (Class: UserSettingsPage, Method: loadData()");
            Logger.error(error);
        });
    }

    /**
     * transform globalDepartmentConfigDataObject to array of numbers to set it in model afterwards
     */
    get selectedDepartmentIds() {
        if (this.userDepartmentFilterCheckboxParsed) {
            return this.userDepartmentFilterCheckboxParsed.filter(department => department.checked).map(department => department.details.departmentId);
        };
    };

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
                        this.loadFilterData();
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

    private pushFilter() {
        this.navCtrl.push("UserFilterPage", {
        }).then((canEnterView) => {
            if (!canEnterView) {
                // in the case that the view can not be entered redirect the user to the login page
                this.navCtrl.setRoot("LoginPage");
            }
        });
    }

    private showSelectFilterAlert() {
        let selectFilterAlert = this.alertCtrl.create();
        selectFilterAlert.setTitle("Select departments");

        this.userDepartmentFilterCheckboxParsed.forEach(department => {
            selectFilterAlert.addInput({
                type: "checkbox",
                label: department.details.departmentName,
                value: department.details.departmentId.toString(),
                checked: department.checked
            });
        });

        selectFilterAlert.addButton("Cancel");
        selectFilterAlert.addButton({
            text: "OK",
            handler: data => {
                this.userDepartmentFilterConfig.selectedDepartments = data.map(Number);

                this.appModelService.setUserDepartmentFilterConfigDataObject(this.userDepartmentFilterConfig).then((data) => {
                    Logger.log("Successfully set UserDepartmentFilterConfigDataObject (Class: UserSettingsPage, Method: updateModel()");
                    Logger.log(data);
                }, (error) => {
                    Logger.log("Setting UserDepartmentFilterConfigDataObject not successfull (Class: UserSettingsPage, Method: updateModel()");
                    Logger.error(error);
                });

                this.loadData();
            }
        });
        selectFilterAlert.present();
    }

    private logout() {
        this.appModelService.logout(() => {
            // successfully loged-out
            this.navCtrl.setRoot("LoginPage");

        }, (error: SuperLoginClientError) => {
            alert(error.getErrorMessage());
        });
    }

    private pushEntryListPage(departmentId?: number) {
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
