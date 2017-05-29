import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntryListInterface } from "./entry-list-interface";
import { DummyEntryList } from "./dummy-class-entry-list";
import { Logger } from "../../app/logger";
import { SingleEntryPage } from "../single-entry/single-entry";

/**
 * Class for the EntryListPage page.
 */
@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'entry-list.html',
})
export class EntryListPage {
  // navParams
  private department: String;
  
  // interact with model
  private entryListInterface: EntryListInterface;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.department = this.navParams.get("department");

    // instantiate model object for interaction and get data
    this.entryListInterface = new DummyEntryList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryListPage');
  }

  // Navigation method for single entry
  pushEntry(entryId: number) {
    this.navCtrl.push(SingleEntryPage, {
      entryId: entryId
    })
  }

}
