import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { LanguagePopoverPageModelInterface } from "./language-popover.model-interface";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { Logger } from "../../app/logger";
import { GlobalLanguageConfigDataobject } from "../../providers/dataobjects/global-language-config.dataobject";
import { UserLanguageFilterConfigDataobject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

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
  private allLanguages: GlobalLanguageConfigDataobject;
  private selectedLanguage: UserLanguageFilterConfigDataobject;

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
    // load data
    this.loadData();
  };

  private ionViewCanEnter(): Promise<boolean> {
    return this.languagePopoverPageModelInterface.isAuthenticated();
  }

  /**
   * PAGE METHODS
   */
  private loadData() {
    // get current language
    this.languagePopoverPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

      // get all languages
      this.allLanguages = this.languagePopoverPageModelInterface.getAllLanguages();

    }, (error) => {
      Logger.log("Loading current language failed (Class: LanguagePopoverPage, Method: loadData()");
    });

  };

  /**
   * NAVIGATION METHODS
   */
  private dismissPopover() {
    this.languagePopoverPageModelInterface.setSelectedLanguage(this.selectedLanguage);
    this.viewCtrl.dismiss();
  }
};
