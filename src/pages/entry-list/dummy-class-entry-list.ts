/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
import { EntryListInterface } from "./entry-list-interface";

export class DummyEntryList implements EntryListInterface {

    public getEntryList(searchString: String, departmentId?: number): Array<String> {
        return ["Entry 1", "Entry 2", "Entry 3"]
    }
}