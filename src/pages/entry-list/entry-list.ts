import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntryListInterface } from "./entry-list-interface";
import { DummyEntryList } from "./dummy-class-entry-list";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";

@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'entry-list.html',
})
export class EntryListPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private departmentId: number;

  // access interface implementation
  private entryListInterface: EntryListInterface;

  // model object for two-way binding and storage of entries
  private entryList: Array<String>;

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  // searchText from searchbar
  private searchText: String;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.departmentId = this.navParams.get("departmentId");

    // instantiate model object for interaction and load entrylist
    this.entryListInterface = new DummyEntryList();
    this.entryList = this.entryListInterface.getEntryList("", this.departmentId);

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();
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
      return this.dummyResolveDepartment.resolveDepartment(this.departmentId);
    else
      return "All";
  }

  // Methods for searchbar
  private onInput() {
    this.entryList = this.entryListInterface.getEntryList(this.searchText, this.departmentId);
  }
}
