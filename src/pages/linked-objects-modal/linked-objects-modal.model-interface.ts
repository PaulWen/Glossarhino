import {DepartmentDataObject} from "../../providers/dataobjects/department.dataobject";
import {GlobalDepartmentConfigDataObject} from "../../providers/dataobjects/global-department-config.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { LoadingController } from "ionic-angular";

export interface LinkedObjectsModalModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  getDepartmentById(departmentId: string): DepartmentDataObject;
  getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getEntryDataObjectToShow(_id: string, languageId: string): Promise<EntryDataObject>;
}
