import { Department } from "./department-model";

/**
 * Entry class for usage in model and controller. Class defines how entries should be specified
 */
export class Entry {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private name: String;

    // the index of the department matches the departmendId for easier access and less effort to find the correct department
    private departments: Array<Department>

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor(name: String, departments: Array<Department>) {
        this.name = name;
        this.departments = departments
    }
}