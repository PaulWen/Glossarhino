import { Attachment } from "./attachment-model";

/**
 * Department class for uage in model and controller. Class specifies departments
 */
export abstract class Department {

    abstract get departmentId():number;
    abstract set departmentId(departmentId: number);

    abstract get description():string;
    abstract set description(description: string);

    abstract get attachments():Array<Attachment>;
    abstract set attachments(attachments: Array<Attachment>);

    abstract get name():string;
    abstract set name(name: string);

    abstract get email():string;
    abstract set email(email: string);

}
