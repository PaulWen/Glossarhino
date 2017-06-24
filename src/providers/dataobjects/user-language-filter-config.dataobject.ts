import {AppConfig} from "../../app/app-config";
import {GlobalLanguageConfigDataobject} from "./global-language-config.dataobject";

export abstract class UserLanguageFilterConfigDataObject {

  abstract get _id(): string;
  abstract get selectedLanguage(): number;
  abstract set selectedLanguage(selectedLanguage: number);


  public static init(globalLanguageConfig: GlobalLanguageConfigDataobject): UserLanguageFilterConfigDataObject {
    return {
      "_id": AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS,
      "selectedLanguage": globalLanguageConfig.languages[0].languageId
    }
  }


}
