/**
 * Interface to define what LanguagePopover needs implemented in order to work
 */
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";

export interface LanguagePopoverPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getAllLanguages: () => Promise<Array<LanguageDataobject>>;
  getCurrentLanguage: () => Promise<LanguageDataobject>;
  setCurrentLanguage: (language: LanguageDataobject) => Promise<boolean>;
}
