import { Attachment } from "./attachment-model";

/**
 * Department class for uage in model and controller. Class specifies departments
 */
export class Department {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private departmentId: number;
    private description: String;
    private attachments: Array<Attachment>
    private name: String;
    private email: String;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor (departmentId: number, description: String, attachments: Array<Attachment>, name: String, email: String) {
        this.departmentId = departmentId;
        this.description = description;
        this.attachments = attachments;
        this.name = name;
        this.email = email;
    }
}