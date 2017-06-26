import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { DepartmentDataObject } from "../../providers/dataobjects/department.dataobject";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";

export interface EditModalPageModelInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
    getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject;
    getEntryDataObject(_id: string, languageId: number): Promise<EntryDataObject>;
    setEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<boolean>;
    newEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<String>;
    getDepartmentById(departmentId: number): DepartmentDataObject;
}
