import {EntryDataObject} from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

/**
 * Interface to define what the page Single EntryDataobject needs implemented in order to work
 */
export interface SingleEntryPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getEntryDataobject(_id: string, languageId: number): Promise<EntryDataObject>;


}
