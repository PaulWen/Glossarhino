import {AppConfig} from "../../app/app-config";

export abstract class UserLanguageFilterConfigDataobject {

  abstract get _id(): string;
  abstract get selectedLanguage(): number;


  public static init(): UserLanguageFilterConfigDataobject {
    return {
      "_id": AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS,
      "selectedLanguage": 0
    }
  }


}
