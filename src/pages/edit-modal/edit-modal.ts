import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditModalPageModelInterface } from "./edit-modal.model-interface";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";

/**
 * Generated class for the EditModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;

  // model object
  private editModalPageModelInterface: EditModalPageModelInterface;

  // dataobjects
  private entryDataObject: EntryDataObject;
  

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
  };

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditModalPage');
  }

}