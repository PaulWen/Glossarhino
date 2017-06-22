import {AppConfig} from "../../app/app-config";
import {GlobalLanguageConfigDataobject} from "./global-language-config.dataobject";

export abstract class UserLanguageFilterConfigDataobject {

  abstract get _id(): string;
  abstract get selectedLanguage(): number;


  public static init(globalLanguageConfig: GlobalLanguageConfigDataobject): UserLanguageFilterConfigDataobject {
    return {
      "_id": AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS,
      "selectedLanguage": globalLanguageConfig.languages[0].languageId
    }
  }


}
