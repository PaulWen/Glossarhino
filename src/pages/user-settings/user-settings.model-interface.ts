import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";

/**
 * Interface to define what UserSettingsPage needs implemented in order to work
 */
export interface UserSettingsPageModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
    getUserDepartmentFilterConfigDataObject(): Promise<UserDepartmentFilterConfigDataObject>;
    setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject): Promise<UserDepartmentFilterConfigDataObject>;
}