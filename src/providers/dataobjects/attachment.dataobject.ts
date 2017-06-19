/**
 * AttachmentDataobject class for usage in model and controller. Class specifies attachments
 */
export abstract class AttachmentDataobject {

  abstract get name(): string;

  abstract get url(): string;

}
