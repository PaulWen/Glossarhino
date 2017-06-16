import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LanguagePopoverPageInterface } from "./language-popover-interface";
import { DummyLanguagePopover } from "./dummy-class-language-popover";

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    // instantiate model objects
    this.languagePopoverPageInterface = new DummyLanguagePopover();
    this.languages = this.languagePopoverPageInterface.getLanguages();
    this.currentLanguage = this.languagePopoverPageInterface.getLanguage();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * Method to dismiss and close the popover once a language is selected
   */
  private close() {
    this.languagePopoverPageInterface.setLanguage(this.currentLanguage);
    this.viewCtrl.dismiss();
  }
}
