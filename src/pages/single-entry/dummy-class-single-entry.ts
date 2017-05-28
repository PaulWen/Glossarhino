import { SingleEntryInterface } from "./single-entry";
import { Entry, DepartmentDetails } from "../../providers/model/entry-model";
import { AppConfig } from "../../app/app-config";

// This is a dummy class for testing purposes. Will implement the SingleEntryInterface.
export class DummySingleEntry implements SingleEntryInterface {

    // Array for implementation of SingleEntryInterface
    private departments: Array<DepartmentDetails> = [{departmentIdentifier: "Marketing", departmentContent: AppConfig.LOREM_IPSUM}, {departmentIdentifier: "Production", departmentContent: AppConfig.LOREM_IPSUM}, {departmentIdentifier: "Management", departmentContent: AppConfig.LOREM_IPSUM}];
    
    private entry: Entry = new Entry("Eintrag 1", 1, AppConfig.LOREM_IPSUM, this.departments)

    public getEntry(id: number): Entry {
        return this.entry
    }
}