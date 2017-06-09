/**
 * Interface to define what this page needs implemented in order to work
 */
export interface EntryListInterface {
    getEntryList: (searchString: String, departmentId?: number) => Array<String>;
}