import {LanguageDataobject} from "./language.dataobject";


export abstract class GlobalLanguageConfigDataobject {

  abstract get languages(): Array<LanguageDataobject>;

}
