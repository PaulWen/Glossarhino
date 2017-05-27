// Entry class for usage in model and controller. Class defines how entries should be specified

export class Entry {
    private name: String;
    private id: number;
    private description: String;
    private departments: Array<String>

    constructor (name: String, id: number, description: String, departments: Array<String>) {

        this.name = name;
        this.id = id;
        this.description = description;
        this.departments = departments
    }
}