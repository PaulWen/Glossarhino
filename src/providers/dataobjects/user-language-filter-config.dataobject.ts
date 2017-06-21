import {LanguageFilterDataobject} from "./language-filter.dataobject";
import {GlobalLanguageConfigDataobject} from "./global-language-config.dataobject";
import {AppConfig} from "../../app/app-config";

export abstract class UserLanguageFilterConfigDataobject {

  abstract get _id(): string;
  abstract get languageFilters(): Array<LanguageFilterDataobject>;


  public static getCurrentLanguageId(userLanguageFilterConfigDataobject: UserLanguageFilterConfigDataobject): number {
    for (let languageFilter of userLanguageFilterConfigDataobject.languageFilters) {
      if (languageFilter.filtered) {
        return languageFilter.languageId;
      }
    }
  }


  public static init(allLanguages: GlobalLanguageConfigDataobject): UserLanguageFilterConfigDataobject {
    let languageFilters: Array<LanguageFilterDataobject> = [];

    let i: number = 0;
    for (let language of allLanguages.languages) {
      if (i == 0) {
        languageFilters.push(LanguageFilterDataobject.init(language.languageId, true))
      } else {
        languageFilters.push(LanguageFilterDataobject.init(language.languageId, false))
      }
      i++;
    }

    return {
      "_id": AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS,
      "languageFilters": languageFilters
    }
  }


}
