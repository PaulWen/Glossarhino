import { Promise } from "es6-promise";
/**
 * Interface to define what the FilterModal needs implemented in order to work
 */
export interface FilterModalInterface {

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    isAuthenticated(): Promise<boolean> | boolean;

    getAllDepartments: () => Array<number>;
    resolveDepartmentId: (departmentId: number) => String;
    getFilter: () => Array<boolean>;
    setFilter: (filterSettings: Array<boolean>) => void;
}
