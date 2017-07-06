import {DepartmentDataObject} from "../../providers/dataobjects/department.dataobject";
import {EntryDataObject} from "../../providers/dataobjects/entry.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { LoadingController } from "ionic-angular";

export interface SingleEntryTabsPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getEntryDataObjectToShow(_id: string, languageId: string): Promise<EntryDataObject>;
  getDepartmentById(departmentId: string): DepartmentDataObject;


}
