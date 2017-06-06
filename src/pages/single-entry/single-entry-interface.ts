import { Entry } from "../../providers/model/entry-model";
import { Contact } from "../../providers/model/contact-model";

/**
 * Interface to define what the page Single Entry needs implemented in order to work
 */ 
export interface SingleEntryInterface {
  getEntry: (name: String) => Entry;
}