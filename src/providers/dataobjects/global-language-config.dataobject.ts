import {LanguageDataobject} from "./language.dataobject";


export abstract class GlobalLanguageConfigDataobject {

  abstract get languages(): Array<LanguageDataobject>;

  public getLanguageDataObjectById(languageId: string): LanguageDataobject {
    for (let language of this.languages) {
      if (language.languageId == languageId) {
        return language;
      }
    }

    return null;
  }

}
