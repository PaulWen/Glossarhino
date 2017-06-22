import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { GlobalLanguageConfigDataobject } from "../../providers/dataobjects/global-language-config.dataobject";

/**
 * Interface to define what LanguagePopover needs implemented in order to work
 */
export interface LanguagePopoverPageModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  getAllLanguages: () => Promise<GlobalLanguageConfigDataobject>;
  getCurrentLanguageId: () => Promise<number>;
  setCurrentLanguageId: (languageId: number) => Promise<string>;
}
