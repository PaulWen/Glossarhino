import { Component } from "@angular/core";
import { IonicPage, NavController, PopoverController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { SuperLoginClientError } from "../../providers/super_login_client/super_login_client_error";
import { DepartmentDataobject } from "../../providers/dataobjects/department.dataobject";
import { DepartmentFilterDataobject } from "../../providers/dataobjects/department-filter.dataobject";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { HomePageModelInterface } from "./home.model-interface";
import { Observable } from "rxjs/Observable";
import { Logger } from "../../app/logger";
import { Subscriber } from "rxjs/Subscriber";

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
  private departments: Array<DepartmentDataobject>;
  private departmentFilter: Array<DepartmentFilterDataobject>;
  private currentLanguage: LanguageDataobject;
  private departmentListings: Array<{ departmentId: number, listings: number }>;

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
   * ionic lifecycle methods
   */

  private async ionViewDidLoad() {
    // instantiate dataobjects
    this.departments = await this.homePageModelInterface.getAllDepartments();
    this.departmentFilter = await this.homePageModelInterface.getDepartmentFilter();
    this.currentLanguage = await this.homePageModelInterface.getCurrentLanguage();

    // Log objects to check if they are successfully retreived
    Logger.log("Departments:");
    Logger.log(this.departments);
    Logger.log("Department filter:");
    Logger.log(this.departmentFilter);
    Logger.log("Current Language:");
    Logger.log(this.currentLanguage);
  };

  private ionViewWillEnter() {
    Logger.log("ionViewWillEnter");
  };

  private ionViewDidEnter() {
    Logger.log("ionViewDidEnter");
  };
  private ionViewWillLeave() {
    Logger.log("ionViewWillLeave");
  };
  private ionViewDidLeave() {
    Logger.log("ionViewDidLeave");
  };
  private ionViewWillUnload() {
    Logger.log("ionViewWillUnload");
  };
  private ionViewCanLeave() {
    Logger.log("ionViewCanLeave");
  };

  private ionViewCanEnter(): Promise<boolean> | boolean {
    Logger.log("ionViewCanEnter");
    return this.homePageModelInterface.isAuthenticated();
  }

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
  private pushList(departmentId?: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

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
  }

}
