/**
 * Attachment class for usage in model and controller. Class specifies attachments
 */
export abstract class Attachment {

  abstract get name():string;
  abstract set name(name: string);

  abstract get url():string;
  abstract set url(url: string);

}
