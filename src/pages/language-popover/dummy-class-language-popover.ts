import { LanguagePopoverPageInterface } from "./language-popover-interface";
import { Logger } from "../../app/logger";
import {Promise} from "es6-promise";

/**
 * Dummy class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyLanguagePopover implements LanguagePopoverPageInterface {

    public isAuthenticated(): Promise<boolean>|boolean {
      return true;
    }

    public getAllLanguages(): Array<String> {
        return ["English", "German"];
    };

    public getLanguage(): String {
        return "English";
    }

    public setLanguage(language: String) {
        Logger.log("Language successfully changed to: " + language);
    }

}
