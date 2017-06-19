import {Promise} from "es6-promise";
import {EntryDataobject} from "../../providers/dataobjects/entry.dataobject";

/**
 * Interface to define what the page Single EntryDataobject needs implemented in order to work
 */
export interface SingleEntryInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getEntry: (name: String) => EntryDataobject;
  getFilter: () => Array<boolean>;
  resolveDepartmentId: (departmentId: number) => String;


}
