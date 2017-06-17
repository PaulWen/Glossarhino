import { Department } from "./department-model";

/**
 * Entry class for usage in model and controller. Class defines how entries should be specified
 */
export abstract class Entry {
    abstract get _id():number;

    abstract get name():string;
    abstract set name(name: string);

    // the index of the department matches the departmendId for easier access and less effort to find the correct department
    abstract get departments():Array<Department>;
    abstract set departments(departments: Array<Department>);
}
