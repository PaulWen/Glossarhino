import {GlobalDepartmentConfigDataObject} from "../../providers/dataobjects/global-department-config.dataobject";
import {HomePageDepartmentDataobject} from "../../providers/dataobjects/homepage.department.dataobject";
import {UserDepartmentFilterConfigDataObject} from "../../providers/dataobjects/user-department-filter-config.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import {SuperLoginClientDoneResponse} from "../../providers/super_login_client/super_login_client_done_reponse";
import {SuperLoginClientErrorResponse} from "../../providers/super_login_client/super_login_client_error_reponse";
import { LoadingController } from "ionic-angular";

export interface HomePageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  /**
   * The method logs out the user. The current session token gets invalid.
   *
   * @param done callback function once the request was successful
   * @param error callback function in case an error occurred
   */
  logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void;

  //////////////////////////////////////////
  //        Functions to get data         //
  //////////////////////////////////////////

  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  getSelectedHomePageDepartmentDataobjects(currentLanguageId: string): Promise<Array<HomePageDepartmentDataobject>>;
  getCountOfAllEntries(selectedLanguage: string): Promise<number>;
  setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataObject): Promise<boolean>;

  // data for user filter settings
  getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
  getUserDepartmentFilterConfigDataObject(): Promise<UserDepartmentFilterConfigDataObject>;
  setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject): Promise<boolean>;
}
