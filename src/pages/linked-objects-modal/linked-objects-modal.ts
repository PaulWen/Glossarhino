import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LinkedObjectsModalModelInterface } from "./linked-objects-modal.model-interface";
import { AppModelService } from "../../providers/app-model-service";

@IonicPage()
@Component({
  selector: 'page-linked-objects-modal',
  templateUrl: 'linked-objects-modal.html',
})
export class LinkedObjectsModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;

  // navparams
  private relatedDepartments: Array<number>;
  private relatedEntries: Array <string>;
  private synonyms: Array<string>;
  private acronyms: Array<string>;

  // model object
  private appModelService: LinkedObjectsModalModelInterface;

  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, appModelService: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

    // get navParams
    this.relatedDepartments = this.navParams.get("relatedDepartments");
    this.relatedEntries = this.navParams.get("relatedEntries");
    this.synonyms = this.navParams.get("synonyms");
    this.acronyms = this.navParams.get("acronyms");

    // instantiate model
    this.appModelService = appModelService
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeLinkedObjectsModal() {
    this.viewCtrl.dismiss();
  }

}
