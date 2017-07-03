import {GlobalLanguageConfigDataobject} from "../../providers/dataobjects/global-language-config.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { LoadingController } from "ionic-angular";

/**
 * Interface to define what LanguagePopover needs implemented in order to work
 */
export interface LanguagePopoverPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  getAllLanguages(): GlobalLanguageConfigDataobject;
  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataObject): Promise<boolean>;
}
