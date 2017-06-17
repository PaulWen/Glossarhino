import {Promise} from "es6-promise";
/**
 * Interface to define what LanguagePopover needs implemented in order to work
 */
export interface LanguagePopoverPageInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getAllLanguages: () => Array<String>;
    getLanguage: () => String;
    setLanguage: (language: String) => void;
}
