import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppModelService} from "../../providers/app-model-service";
import {GlobalLanguageConfigDataobject} from "../../providers/dataobjects/global-language-config.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import {LanguagePopoverPageModelInterface} from "./language-popover.model-interface";

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
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;

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

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////
  
  private ionViewDidLoad() {
    // load data
    this.loadData();
  };

  private ionViewCanEnter(): Promise<boolean> {
    return this.languagePopoverPageModelInterface.isAuthenticated();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData() {
    // get current language
    this.languagePopoverPageModelInterface.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // get all languages
      this.allLanguages = this.languagePopoverPageModelInterface.getAllLanguages();

    }, (error) => {
      Logger.log("Loading current language failed (Class: LanguagePopoverPage, Method: loadData()");
    });
  };

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private dismissPopover() {
    // convert input into number
    this.selectedLanguageDataObject.selectedLanguage = this.selectedLanguageDataObject.selectedLanguage;
    this.languagePopoverPageModelInterface.setSelectedLanguage(this.selectedLanguageDataObject);
    this.viewCtrl.dismiss();
  };
}
;
