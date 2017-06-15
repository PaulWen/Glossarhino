import { Entry } from "../../providers/model/entry-model";

/**
 * Interface to define what the modal EditModal needs implemented in order to work
 */ 
export interface EditModalInterface {
  getDepartments: () => Array<number>;
  setEntry: (entry: Entry) => void;
}