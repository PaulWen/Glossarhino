import {Promise} from "es6-promise";
import {EntryDataobject} from "../../providers/dataobjects/entry.dataobject";
import {EditModalInterface} from "./edit-modal-interface";

/**
 * This is a dummy class for testing purposes. Will implement the SingleEntryInterface
 */
export class DummyEditModal implements EditModalInterface {

  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  };

  public getAllDepartments(): Array<number> {
    let departments: Array<number> = [0, 1, 2, 3];
    return departments;
  };

  public setEntry(entry: EntryDataobject) {
  };

  public resolveDepartmentId(departmentId: number): String {
    switch (departmentId) {
      case 0: {
        //statements;
        return "Description";
      }
      case 1: {
        //statements;
        return "Management";
      }
      case 2: {
        //statements;
        return "Marketing";
      }
      case 3: {
        //statements;
        return "Production";
      }
      default: {
        //statements;
        return "No department found with id: " + departmentId;
      }
    }
  };
}
