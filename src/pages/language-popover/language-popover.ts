import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { LanguagePopoverPageModelInterface } from "./language-popover.model-interface";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: "page-language-popover",
  templateUrl: "language-popover.html"
})
export class LanguagePopoverPage {
  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;

  // model objects
  private languagePopoverPageModelInterface: LanguagePopoverPageModelInterface;
  private allLanguages: Array<LanguageDataobject>;
  private currentLanguageId: number;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

    // instantiate model object
    this.languagePopoverPageModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  /**
   * IONIC LIFECYCLE METHODS
   */
  private ionViewDidLoad() {
    // get all languages
    this.languagePopoverPageModelInterface.getAllLanguages().then((data) => {
      this.allLanguages = data;
    }, (error) => {
      Logger.log("Loading all languages failed");
    });

    // get current language
    this.languagePopoverPageModelInterface.getCurrentLanguage().then((data) => {
      this.currentLanguageId = data.languageId;
    }, (error) => {
      Logger.log("Loading current language failed");
    });
  };

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.languagePopoverPageModelInterface.isAuthenticated();
  }

  /**
   * PAGE METHODS
   */
   private loadData() {

   };

  /**
   * NAVIGATION METHODS
   */
  private dismissPopover() {
    Logger.log(this.currentLanguageId);
    this.languagePopoverPageModelInterface.setCurrentLanguage(this.currentLanguageId);
    this.viewCtrl.dismiss();
  }
};
