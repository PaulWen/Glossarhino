import {DepartmentDataObject} from "../../providers/dataobjects/department.dataobject";
import {GlobalDepartmentConfigDataObject} from "../../providers/dataobjects/global-department-config.dataobject";

export interface LinkedObjectsModalModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean>;

  getDepartmentById(departmentId: string): DepartmentDataObject;
  getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
}
