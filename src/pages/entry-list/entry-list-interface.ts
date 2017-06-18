import {Promise} from "es6-promise";
/**
 * Interface to define what the EntryListPage needs implemented in order to work
 */
export interface EntryListInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getLanguage: () => String;
  getEntryList: (searchString: String, language: String, departmentId?: number) => Array<String>;
  resolveDepartmentId: (departmentId: number) => String;
}
