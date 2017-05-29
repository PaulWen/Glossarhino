/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
import { EntryListInterface } from "./entry-list-interface";
import { Entry, DepartmentDetails } from "../../providers/model/entry-model";
import { AppConfig } from "../../app/app-config";

export class DummyEntryList implements EntryListInterface {
    
    private departments: Array<DepartmentDetails> = [{departmentIdentifier: "Marketing", departmentContent: AppConfig.LOREM_IPSUM}, {departmentIdentifier: "Production", departmentContent: AppConfig.LOREM_IPSUM}, {departmentIdentifier: "Management", departmentContent: AppConfig.LOREM_IPSUM}];
    
    private entry1: Entry = new Entry("Entry 1", 1, AppConfig.LOREM_IPSUM, this.departments);

    private entry2: Entry = new Entry("Entry 2", 2, AppConfig.LOREM_IPSUM, this.departments)

    private entries: Array<Entry> = [this.entry1, this.entry2]

    public getEntries(category: String) {
        return this.entries
    }
}