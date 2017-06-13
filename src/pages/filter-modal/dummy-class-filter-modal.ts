import { FilterModalInterface } from "./filter-modal-interface";
import { Logger } from "../../app/logger";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyFilterModal implements FilterModalInterface {

    private filterSettings: Array<boolean> = [];
    
    public getDepartments(): Array<number> {
        return [1, 2, 3];
    }

    public getFilter() {
        return this.filterSettings;
    }

    public setFilter(filterSettings: Array<boolean>) {
        this.filterSettings = filterSettings;
    }
}