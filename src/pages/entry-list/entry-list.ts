import {Component, ViewChild} from "@angular/core";
import {Promise} from "es6-promise";
import {IonicPage, NavController, NavParams, Searchbar} from "ionic-angular";
import {AppModelService} from "../../providers/app-model-service";
import {EntryListInterface} from "./entry-list-interface";

@IonicPage()
@Component({
  selector: "page-entry-list",
  templateUrl: "entry-list.html"
})
export class EntryListPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private departmentId: number;
  private searchbarFocus: boolean;

  // model objects
  private entryListInterface: EntryListInterface;
  private entryList: Array<String>;
  private currentLanguage: String;

  // searchText from searchbar
  private searchText: String;

  // get access to seachbar itself
  @ViewChild("searchbar") searchbar: Searchbar;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, appModel: AppModelService) {
    // get navParams
    this.departmentId = this.navParams.get("departmentId");
    this.searchbarFocus = this.navParams.get("searchbarFocus");

    // instantiate model objects
    this.entryListInterface = appModel;
    this.currentLanguage = this.entryListInterface.getLanguage();
    this.entryList = this.entryListInterface.getEntryList("", this.currentLanguage, this.departmentId);
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.entryListInterface.isAuthenticated();
  }

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
      return this.entryListInterface.resolveDepartmentId(this.departmentId);
    else
      return "All";
  }

  // Methods for searchbar
  private onInput() {
    this.entryList = this.entryListInterface.getEntryList(this.searchText, "", this.departmentId);
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
