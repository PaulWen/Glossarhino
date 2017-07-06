import { LoadingController } from "ionic-angular";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";

export interface DepartmentFilterModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

    getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
    getUserDepartmentFilterConfigDataObject(): Promise<UserDepartmentFilterConfigDataObject>;
    setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject): Promise<boolean>;
}