import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Searchbar } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { EntryListPageModelInterface } from "./entry-list.model-interface";
import { UserLanguageFilterConfigDataobject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";

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

  // navParams
  private departmentId: number;
  private departmentName: string;
  private searchbarFocus: boolean;

  // model objects
  private entryListPageModelInterface: EntryListPageModelInterface;
  private entryList: Array<string>;
  private selectedLanguage: UserLanguageFilterConfigDataobject;

  // searchText from searchbar
  private searchText: string;

  // get access to seachbar itself
  @ViewChild("searchbar") searchbar: Searchbar;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;

    // get navParams
    this.departmentId = this.navParams.get("departmentId");
    this.departmentName = this.navParams.get("departmentName");
    this.searchbarFocus = this.navParams.get("searchbarFocus");

    // instantiate model
    this.entryListPageModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  /**
   * IONIC LIFECYCLE METHODS
   */
  private ionViewDidLoad() {
    // load data
    this.loadData(this.departmentId);
  };

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.entryListPageModelInterface.isAuthenticated();
  };

  /**
   * PAGE METHODS
   */
  private loadData(departmendId?: number) {
    // get selected language
    this.entryListPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

      // load other data as soon as language loaded
      // get entryname list
      this.entryListPageModelInterface.getEntryNameList(this.searchText, this.selectedLanguage.selectedLanguage, departmendId).then((data) => {
        this.entryList = data;
      }, (error) => {
        Logger.log("Loading entry list failed (Class: EntryListPage, Method: loadData()");
      });

    }, (error) => {
      Logger.log("Loading selected language failed (Class: EntryListPage, Method: loadData()");
    });

  };

  /**
   * NAVIGATION METHODS
   */
  // Navigation method for single entry
  private pushEntry(name: String) {
    this.navCtrl.push("SingleEntryPage", {
      name: name
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  // Resolve department and handle departmentId undefined
  private resolveDepartment(departmendId?: number): String {
    if (departmendId)
      return this.entryListPageModelInterface.resolveDepartmentId(this.departmentId);
    else
      return "All";
  }

  // setFocus on searchbar
  private ionViewDidEnter() {
    if (this.searchbarFocus) {
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 50);
    }
  }
}
