/**
 * Interface to define what this page needs implemented in order to work
 */
export interface HomePageInterface {
    getDepartments: () => Array<number>;
    getListings: (departmentId: number) => number;
}