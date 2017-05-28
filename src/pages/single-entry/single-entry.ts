import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Entry } from "../../providers/model/entry-model";
import { AppConfig } from "../../app/app-config";


// Interface to define what this page needs implemented in order to work
export interface SingleEntryInterface {
  getEntry: (id: number) => Entry;
}

/**
 * Generated class for the SingleEntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-single-entry',
  templateUrl: 'single-entry.html',
})
export class SingleEntryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private loremIpsum: String = AppConfig.LOREM_IPSUM;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleEntryPage');
  }

}
