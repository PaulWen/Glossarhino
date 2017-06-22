import { SuperLoginClientDoneResponse } from "../../providers/super_login_client/super_login_client_done_reponse";
import { SuperLoginClientErrorResponse } from "../../providers/super_login_client/super_login_client_error_reponse";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { HomePageDepartmentDataobject } from "../../providers/dataobjects/homepage.department.dataobject";
import { UserLanguageFilterConfigDataobject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
/**
 * Interface to define what HomePage needs implemented in order to work
 */
export interface HomePageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  /**
   * The method logs out the user. The current session token gets invalid.
   *
   * @param done callback function once the request was successful
   * @param error callback function in case an error occurred
   */
  logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void;

  getCurrentLanguage(): Promise<UserLanguageFilterConfigDataobject>;
  getSelectedDepartments(currentLanguageId: number): Promise<Array<HomePageDepartmentDataobject>>;
  getAllListings(currentLanguageId: number): Promise<number>;
}
