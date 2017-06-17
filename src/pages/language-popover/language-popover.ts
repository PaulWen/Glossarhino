import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LanguagePopoverPageInterface } from "./language-popover-interface";
import { DummyLanguagePopover } from "./dummy-class-language-popover";
import {Promise} from "es6-promise";
import {AppModelService} from "../../providers/model/app-model-service";

@IonicPage()
@Component({
  selector: 'page-language-popover',
  templateUrl: 'language-popover.html',
})
export class LanguagePopoverPage {
  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // model objects
  private languagePopoverPageInterface: LanguagePopoverPageInterface;
  private languages: Array<String>;
  private currentLanguage: String;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate model objects
    this.languagePopoverPageInterface = appModel;
    this.languages = this.languagePopoverPageInterface.getAllLanguages();
    this.currentLanguage = this.languagePopoverPageInterface.getLanguage();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.languagePopoverPageInterface.isAuthenticated();
  }

  /**
   * Method to dismiss and close the popover once a language is selected
   */
  private close() {
    this.languagePopoverPageInterface.setLanguage(this.currentLanguage);
    this.viewCtrl.dismiss();
  }
}
