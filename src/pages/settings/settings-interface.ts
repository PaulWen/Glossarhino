/**
 * Interface to define what SettingsPage needs implemented in order to work
 */
export interface SettingsPageInterface {
    getDepartments: () => Array<number>;
    setPreferences: (departmentId: number, value: boolean) => void;
}