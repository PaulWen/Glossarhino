/**
 * Interface to define what this page needs implemented in order to work
 */
export interface HomePageInterface {
    getDepartments: () => Array<String>;
    getListings: (department: String) => number;
}