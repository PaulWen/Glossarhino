import {Promise} from "es6-promise";
import {FilterModalInterface} from "./filter-modal-interface";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyFilterModal implements FilterModalInterface {


  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  };

  private filterSettings: Array<boolean> = [];

  public getAllDepartments(): Array<number> {
    return [1, 2, 3];
  };

  public getFilter() {
    return this.filterSettings;
  };

  public setFilter(filterSettings: Array<boolean>) {
    this.filterSettings = filterSettings;
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
