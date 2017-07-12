import { AlertController, LoadingController, NavController } from "ionic-angular";
import { AppModelService } from "../providers/app-model-service";
import { DepartmentDataObject } from "../providers/dataobjects/department.dataobject";
import { GlobalDepartmentConfigDataObject } from "../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../providers/dataobjects/user-department-filter-config.dataobject";
import { Logger } from "./logger";
import { GlobalLanguageConfigDataobject } from "../providers/dataobjects/global-language-config.dataobject";
import {Observable} from "rxjs/Rx";
import {TranslateService} from "@ngx-translate/core";

/**
 * This class implements all the alerts needed for the app
 */
export class Alerts {

  ////////////////////////////////////////////Properties////////////////////////////////////////////

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //            Loading Alert             //
  //////////////////////////////////////////

  public static presentLoadingDefault(loadingCtrl: LoadingController, translateService: TranslateService): any {
    let loading = loadingCtrl.create();

    Observable.zip(
      translateService.get("LOADING"),
      (loadingStr: string) => {
        loading.setContent(loadingStr);
        return loading;
      }
    ).subscribe((loadingCtl)=>{
      loadingCtl.present();
    });

    return loading;
  }

  //////////////////////////////////////////
  //           Language Alert             //
  //////////////////////////////////////////

  public static showLanguageSelectionAlert(alertCtrl: AlertController, appModelService: AppModelService, translateService: TranslateService): Promise<string> {
    return new Promise((resolve, reject) => {
      Observable.zip(
        translateService.get("SELECT_LANGUAGE"),
        translateService.get("CANCEL"),
        translateService.get("OK"),
        (selectLanguage: string, cancel: string, ok: string) => {
          let allLanguages: GlobalLanguageConfigDataobject = appModelService.getAllLanguages();

          let languageSelectionAlert = alertCtrl.create({
            title: selectLanguage
          });

          allLanguages.languages.forEach(language => {
            languageSelectionAlert.addInput({
              type: "radio",
              label: language.languageName,
              value: language.languageId
            });
          });

          // add cancel button
          languageSelectionAlert.addButton(cancel);

          // add okay button
          languageSelectionAlert.addButton({
            text: ok,
            handler: data => {
              resolve(data);
            }
          });

          return languageSelectionAlert;
        }
      ).subscribe((alert)=>{
        alert.present();
      });
    });
  }

  //////////////////////////////////////////
  //           No Entry Alert             //
  //////////////////////////////////////////

  public static showNoEntryAlert(alertCtrl: AlertController, navCtrl: NavController, entryDocumentId: string, languageId: string, translateService: TranslateService) {
    Observable.zip(
      translateService.get("NO_ENTRY_ALERT_TITLE"),
      translateService.get("NO_ENTRY_ALERT_SUBTITLE"),
      translateService.get("ADD"),
      translateService.get("OK"),
      (noEntryAlertTitle: string, noEntryAlertSubtitle: string, add: string, ok: string) => {
        let noEntryAlert = alertCtrl.create({
          title: noEntryAlertTitle,
          subTitle: noEntryAlertSubtitle
        });

        // add add button
        noEntryAlert.addButton({
          text: add,
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

        return noEntryAlert;
      }
    ).subscribe((alert)=>{
      alert.present();
    });
  }
}
