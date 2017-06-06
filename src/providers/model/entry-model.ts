import { Department } from "./department-model";

/**
 * Entry class for usage in model and controller. Class defines how entries should be specified
 */
export class Entry {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private name: String;
    private departments: Array<Department>

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor(name: String, departments: Array<Department>) {
        this.name = name;
        this.departments = departments
    }
}