import {DepartmentDataObject} from "../../providers/dataobjects/department.dataobject";
import {EntryDataObject} from "../../providers/dataobjects/entry.dataobject";
import {GlobalDepartmentConfigDataObject} from "../../providers/dataobjects/global-department-config.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { LoadingController } from "ionic-angular";

export interface EditModalPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
  getCompleteEntryDataObject(_id: string, languageId: string): Promise<EntryDataObject>;
  setEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<boolean>;
  newEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<string>;
  removeEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<boolean>;
  getDepartmentById(departmentId: string): DepartmentDataObject;
}
