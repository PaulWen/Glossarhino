import { Entry } from "../../providers/model/entry-model";

/**
 * Interface to define what the page Single Entry needs implemented in order to work
 */ 
export interface SingleEntryInterface {
  getEntry: (name: String) => Entry;
  getFilter: () => Array<boolean>;
}