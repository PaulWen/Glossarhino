/**
 * Interface to define what the EntryListPage needs implemented in order to work
 */
export interface EntryListInterface {
    getLanguage: () => String;
    getEntryList: (searchString: String, language: String, departmentId?: number) => Array<String>;
}