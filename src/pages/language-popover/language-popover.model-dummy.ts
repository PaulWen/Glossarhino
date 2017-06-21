import { LanguagePopoverPageModelInterface } from "./language-popover.model-interface";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
/**
 * Dummy class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class LanguagePopoverPageModelDummy implements LanguagePopoverPageModelInterface {

  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  }

  public async getAllLanguages(): Promise<Array<LanguageDataobject>> {
        let allLanguages: Array<LanguageDataobject> = [
            {
                languageId: 0,
                languageName: "English"
            }, {
                languageId: 1,
                languageName: "German"
            }
        ];
        return allLanguages;
    }

  public async getCurrentLanguage(): Promise<LanguageDataobject> {
        let currentLanguage: LanguageDataobject = {
            languageId: 0,
            languageName: "English"
        };
        return currentLanguage;
    };

  public async setCurrentLanguage(): Promise<boolean> {
        return true;
    }

}
