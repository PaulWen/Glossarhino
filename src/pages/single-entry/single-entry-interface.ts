import { Entry } from "../../providers/model/entry-model";
import {Promise} from "es6-promise";

/**
 * Interface to define what the page Single Entry needs implemented in order to work
 */
export interface SingleEntryInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getEntry: (name: String) => Entry;
  getFilter: () => Array<boolean>;
}
