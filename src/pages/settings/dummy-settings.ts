import { SettingsPageInterface } from "./settings-interface";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummySettings implements SettingsPageInterface {
    private departments: Array<number> = [1, 2, 3];

    public getDepartments(): Array<number> {
        return this.departments;
    };

    public setPreferences (departmentId: number, value: boolean) {};
}