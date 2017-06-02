/**
 * Attachment class for uage in model and controller. Class specifies attachments
 */
export class Attachment {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private name: String;
    private url: URL;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor(name: String, url: URL) {
        this.name = name;
        this. url = url;
    }
}