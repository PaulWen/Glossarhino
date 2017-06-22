import { UserLanguageFilterConfigDataobject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

/**
 * Interface to define what the EntryListPage needs implemented in order to work
 */
export interface EntryListPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataobject>;
  getEntryNameList(searchString: string, selectedLanguage: number, departmentId?: number): Promise<Array<string>>;
}
