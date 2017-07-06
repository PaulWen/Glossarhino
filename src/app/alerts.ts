import { AlertController, LoadingController, NavController } from "ionic-angular";
import { AppModelService } from "../providers/app-model-service";
import { DepartmentDataObject } from "../providers/dataobjects/department.dataobject";
import { GlobalDepartmentConfigDataObject } from "../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../providers/dataobjects/user-department-filter-config.dataobject";
import { Logger } from "./logger";
import { GlobalLanguageConfigDataobject } from "../providers/dataobjects/global-language-config.dataobject";

/**
 * This class implements all the alerts needed for the app
 */
export class Alerts {

  ////////////////////////////////////////////Properties////////////////////////////////////////////

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //            Loading Alert             //
  //////////////////////////////////////////

  public static presentLoadingDefault(loadingCtrl: LoadingController): any {
    let loading = loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  //////////////////////////////////////////
  //           Language Alert             //
  //////////////////////////////////////////

  public static showLanguageSelectionAlert(alertCtrl: AlertController, appModelService: AppModelService): Promise<string> {
    return new Promise((resolve, reject) => {
      let allLanguages: GlobalLanguageConfigDataobject = appModelService.getAllLanguages();

      let languageSelectionAlert = alertCtrl.create({
        title: "Select language"
      });

      allLanguages.languages.forEach(language => {
        languageSelectionAlert.addInput({
          type: "radio",
          label: language.languageName,
          value: language.languageId
        });
      });

      // add cancel button
      languageSelectionAlert.addButton("Cancel");

      // add okay button
      languageSelectionAlert.addButton({
        text: "OK",
        handler: data => {
          resolve(data);
        }
      });

      // show alert
      languageSelectionAlert.present();
    });
  }

  //////////////////////////////////////////
  //           No Entry Alert             //
  //////////////////////////////////////////

  public static showNoEntryAlert(alertCtrl: AlertController, navCtrl: NavController, entryDocumentId: string, languageId: string) {
    let noEntryAlert = alertCtrl.create({
      title: "Entry not available!",
      subTitle: "Sorry, the entry is not yet available in this language. You can add it by pressing the \"Add\" button"
    });

    // add add button
    noEntryAlert.addButton({
      text: "Add",
      handler: () => {
        navCtrl.push("EditModalPage", {
          addNewEntry: true,
          newEntryDocumentId: entryDocumentId,
          newEntryLanguageId: languageId
        }).then((canEnterView) => {
          if (!canEnterView) {
            // in the case that the view can not be entered redirect the user to the login page
            navCtrl.setRoot("LoginPage");
          }
        });
      }
    });

    // add okay button
    noEntryAlert.addButton({
      text: "OK",
      handler: () => {
        navCtrl.setRoot("HomePage");
      }
    });

    noEntryAlert.present();

  }
}
