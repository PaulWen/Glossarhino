import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntryListInterface } from "./entry-list-interface";
import { DummyEntryList } from "./dummy-class-entry-list";
import { SingleEntryPage } from "../single-entry/single-entry";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'entry-list.html',
})
export class EntryListPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private department: String;

  // access interface implementation
  private entryListInterface: EntryListInterface;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.department = this.navParams.get("department");

    // instantiate model object for interaction
    this.entryListInterface = new DummyEntryList();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  ionViewDidLoad() {
    Logger.log('ionViewDidLoad EntryListPage');
  }

  // Navigation method for single entry
  pushEntry(entryId: number) {
    this.navCtrl.push(SingleEntryPage, {
      entryId: entryId
    })
  }

}