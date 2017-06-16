import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { EntryListInterface } from "./entry-list-interface";
import { DummyEntryList } from "./dummy-class-entry-list";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";
import { AppConfig } from "../../app/app-config";

@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'entry-list.html',
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

  // resolver object
  private departmentResolver: DummyResolveDepartment;

  // searchText from searchbar
  private searchText: String;

  // get access to seachbar itself
  @ViewChild("searchbar") searchbar: Searchbar;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.departmentId = this.navParams.get("departmentId");
    this.searchbarFocus = this.navParams.get("searchbarFocus");

    // instantiate model objects
    this.entryListInterface = new DummyEntryList();
    this.currentLanguage = this.entryListInterface.getLanguage();
    this.entryList = this.entryListInterface.getEntryList("", this.currentLanguage, this.departmentId);

    // instatiate resolver object
    this.departmentResolver = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  // Navigation method for single entry
  private pushEntry(name: String) {
    this.navCtrl.push("SingleEntryPage", {
      name: name
    })
  }

  // Resolve department and handle departmentId undefined
  private resolveDepartment(departmendId?: number): String {
    if (departmendId)
      return this.departmentResolver.resolveDepartment(this.departmentId);
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
      setTimeout(() => { this.searchbar.setFocus(); }, 50);
    }
  }
}
