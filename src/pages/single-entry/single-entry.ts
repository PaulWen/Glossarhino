import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Entry } from "../../providers/model/entry-model";
import { DummySingleEntry } from "./dummy-class-single-entry";
import { SingleEntryInterface } from "./single-entry-interface";
import { Logger } from "../../app/logger";

/**
 * Class for the SingleEntryPage page.
 */
@IonicPage()
@Component({
  selector: 'page-single-entry',
  templateUrl: 'single-entry.html',
})
export class SingleEntryPage {
  // navParams
  private entryId: number;

  // interact with model
  private singleEntryInterface: SingleEntryInterface;
  private entry: Entry;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get navParams
    this.entryId = this.navParams.get("entryId");
    
    // instantiate model object for interaction and get data
    this.singleEntryInterface = new DummySingleEntry();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleEntryPage');
  }
}
