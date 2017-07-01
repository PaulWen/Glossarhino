import {EntryDataObject} from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";

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
  getEntryDataObject(_id: string, languageId: string): Promise<EntryDataObject>;
  getDepartmentById(departmentId: string): DepartmentDataObject;


}
