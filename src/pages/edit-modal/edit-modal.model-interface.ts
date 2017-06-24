import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";

export interface EditModalPageModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
    getEntryDataObject(_id: string, languageId: number): Promise<EntryDataObject>;
    setEntryDataObject(entryDataObject: EntryDataObject): Promise<EntryDataObject>;
    getDepartmentById(departmentId: number): DepartmentDataObject;
}