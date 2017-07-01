import {EntryListPageEntryDataObject} from "../../providers/dataobjects/entrylistpage.entry.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";

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

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getEntryListPageEntryDataObjects(searchString: string, selectedLanguage: string, departmentId?: string): Promise<Array<EntryListPageEntryDataObject>>;
}
