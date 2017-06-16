/**
 * Interface to define what HomePage needs implemented in order to work
 */
export interface HomePageInterface {
    getDepartments: () => Array<number>;
    getListings: (departmentId?: number) => number;
    getFilter: () => Array<boolean>;
    getLanguage: () => String;
}