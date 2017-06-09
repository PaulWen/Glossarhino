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

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.departmentId = this.navParams.get("departmentId");

    // instantiate model object for interaction
    this.entryListInterface = new DummyEntryList();

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryListPage');
  }

  // Navigation method for single entry
  pushEntry(name: String) {
    this.navCtrl.push("SingleEntryPage", {
      name: name
    })
  }

  // Resolve department and handle departmentId undefined
  resolveDepartment(departmendId?: number): String {
    if (departmendId)
    return this.dummyResolveDepartment.resolveDepartment(this.departmentId);
    else
    return "All";
  }
}
