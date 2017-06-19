import {Promise} from "es6-promise";
import {EntryDataobject} from "../../providers/dataobjects/entry.dataobject";

/**
 * Interface to define what the modal EditModal needs implemented in order to work
 */
export interface EditModalInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;


  getAllDepartments: () => Array<number>;
  setEntry: (entry: EntryDataobject) => void;
  resolveDepartmentId: (departmentId: number) => String;

}
