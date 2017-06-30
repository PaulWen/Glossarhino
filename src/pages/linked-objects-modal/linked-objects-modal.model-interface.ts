import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";

export interface LinkedObjectsModalModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getDepartmentById(departmentId: number): DepartmentDataObject;
}