import { FilterModalInterface } from "./filter-modal-interface";
import { Logger } from "../../app/logger";
import {Promise} from "es6-promise";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyFilterModal implements FilterModalInterface {


    public isAuthenticated(): Promise<boolean>|boolean {
      return true;
    }

    private filterSettings: Array<boolean> = [];

    public getAllDepartments(): Array<number> {
        return [1, 2, 3];
    }

    public getFilter() {
        return this.filterSettings;
    }

    public setFilter(filterSettings: Array<boolean>) {
        this.filterSettings = filterSettings;
    }
}
