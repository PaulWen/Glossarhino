import { EntryListInterface } from "./entry-list-interface";
import {Promise} from "es6-promise";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyEntryList implements EntryListInterface {

    public isAuthenticated(): Promise<boolean>|boolean {
      return true;
    }

    public getEntryList(searchString: String, language: String, departmentId?: number): Array<String> {
        if (searchString == "") {
            return ["Entry 1", "Entry 2", "Entry 3"];
        } else {
            return ["Entry 1", "Entry 2"];
        }
    }

    public getLanguage() {
        return "";
    };
}
