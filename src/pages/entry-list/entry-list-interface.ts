import { Entry } from "../../providers/model/entry-model";

/**
 * Interface to define what this page needs implemented in order to work
 */
export interface EntryListInterface {
    getEntries: (category: String) => Array<Entry>;
}