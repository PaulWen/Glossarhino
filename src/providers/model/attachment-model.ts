/**
 * Attachment class for uage in model and controller. Class specifies attachments
 */
export abstract class Attachment {

  abstract get name():string;
  abstract set name(name: string);

  abstract get url():URL;
  abstract set url(url: URL);

}
