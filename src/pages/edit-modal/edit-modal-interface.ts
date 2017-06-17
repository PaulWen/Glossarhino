import { Entry } from "../../providers/model/entry-model";
import { Promise } from "es6-promise";

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
  setEntry: (entry: Entry) => void;
  resolveDepartmentId: (departmentId: number) => String;

}
