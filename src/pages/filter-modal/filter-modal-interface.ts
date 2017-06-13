/**
 * Interface to define what the FilterModal needs implemented in order to work
 */
export interface FilterModalInterface {
    getDepartments: () => Array<number>;
    getFilter: () => Array<boolean>;
    setFilter: (filterSettings: Array<boolean>) => void;
}