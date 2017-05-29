// Define type for entry descriptions in every department for usage as array
export type DepartmentDetails = { departmentIdentifier: String, departmentContent: String }

// Entry class for usage in model and controller. Class defines how entries should be specified
export class Entry {
    private name: String;
    private id: number;
    private description: String;

    private departments: Array<DepartmentDetails>

    constructor (name: String, id: number, description: String, departments: Array<DepartmentDetails>) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.departments = departments
    }
}