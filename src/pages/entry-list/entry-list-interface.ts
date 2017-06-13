/**
 * Interface to define what the EntryListPage needs implemented in order to work
 */
export interface EntryListInterface {
    getEntryList: (searchString: String, departmentId?: number) => Array<String>;
}