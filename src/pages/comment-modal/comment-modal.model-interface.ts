import { UserDataObject } from "../../providers/dataobjects/user.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

export interface CommentModalModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getCurrentUser(): UserDataObject;
    getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
    setEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<boolean>;
}