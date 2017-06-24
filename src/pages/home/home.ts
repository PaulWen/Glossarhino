import { Component } from "@angular/core";
import { IonicPage, NavController, PopoverController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { SuperLoginClientError } from "../../providers/super_login_client/super_login_client_error";
import { HomePageDepartmentDataobject } from "../../providers/dataobjects/homepage.department.dataobject"
import { HomePageModelInterface } from "./home.model-interface";
import { Logger } from "../../app/logger";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

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

    // model object
    private homePageModelInterface: HomePageModelInterface;

    // dataobjects
    private departments: Array<HomePageDepartmentDataobject>;
    private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;
    private countOfAllEntries: number;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////

    constructor(navCtrl: NavController, popoverCtrl: PopoverController, appModel: AppModelService) {
        // instantiate ionic injected components
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;

        // instantiate model object
        this.homePageModelInterface = appModel;
    }


    /////////////////////////////////////////////Methods///////////////////////////////////////////////

    /**
     * IONIC LIFECYCLE METHODS
     */
    private ionViewDidLoad() {
        // load data
        this.loadData();
    };

    private ionViewCanEnter(): Promise<boolean> {
        return this.homePageModelInterface.isAuthenticated();
    };

    /**
     * PAGE METHODS
     */
    private loadData() {
        // get selected language
        this.homePageModelInterface.getSelectedLanguage().then((data) => {
            this.selectedLanguageDataObject = data;
            
            // load other data as soon as language loaded
            // get all listings
            this.homePageModelInterface.getCountOfAllEntries(this.selectedLanguageDataObject.selectedLanguage).then((data) => {
                this.countOfAllEntries = data;
            }, (error) => {
                Logger.log("Loading all listings failed (Class: HomePage, Method: loadData()");
                Logger.error(error);
            });

            // get selected departments
            this.homePageModelInterface.getSelectedHomePageDepartmentDataobjects(this.selectedLanguageDataObject.selectedLanguage).then((data) => {
                this.departments = data;
            }, (error) => {
                Logger.log("Loading selected departments failed (Class: HomePage, Method: loadData()");
                Logger.error(error);
            });

        }, (error) => {
            Logger.log("Loading currentLanguage failed (Class: HomePage, Method: loadData()");
            Logger.error(error);
        });
    };

    /**
     * NAVIGATION METHODS
     */

    /**
     * Logs the user out and directs him to the Login-Page.
     */
    private logout() {
        this.homePageModelInterface.logout(() => {
            // successfully loged-out
            this.navCtrl.setRoot("LoginPage");

        }, (error: SuperLoginClientError) => {
            alert(error.getErrorMessage());
        });
    }

    /**
     * navigate to entry list and hand over department
     * @param departmentId
     */
    private pushList(departmentId: number, departmentName?: string) {
        this.navCtrl.push("EntryListPage", {
            departmentId: departmentId,
            departmentName: departmentName
        }).then((canEnterView) => {
            if (!canEnterView) {
                // in the case that the view can not be entered redirect the user to the login page
                this.navCtrl.setRoot("LoginPage");
            }
        });
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

}
