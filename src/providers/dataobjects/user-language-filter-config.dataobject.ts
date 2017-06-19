import {LanguageFilterDataobject} from "./language-filter.dataobject";

export abstract class UserLanguageFilterConfigDataobject {


  abstract get languageFilters(): Array<LanguageFilterDataobject>;

}
