import { DepartmentEntrySpecificsDataObject } from "./department-entry-description.dataobject";
import { AttachmentDataObject } from "./attachment.dataobject";
import { CommentDataObject } from "./comment.dataobject";

/**
 * EntryDataobject class for usage in model and controller. Class defines how entries should be specified
 */
export abstract class EntryDataObject {
  abstract get _id(): string;

  abstract get name(): string;
  abstract set name(name: string);

  abstract get description(): string;
  abstract set description(description: string);

  abstract get contact(): string;
  abstract set contact(contact: string);

  abstract get email(): string;
  abstract set email(email: string);

  abstract get relatedDepartments(): Array<string>;
  abstract set relatedDepartments(relatedDepartments: Array<string>);

  abstract get relatedEntries(): Array<string>;
  abstract set relatedEntries(relatedEntries: Array<string>);

  abstract get synonyms(): Array<string>;
  abstract set synonyms(synonyms: Array<string>);

  abstract get acronyms(): Array<string>;
  abstract set acronyms(acronyms: Array<string>);

  abstract get attachments(): Array<AttachmentDataObject>;

  abstract get comments(): Array<CommentDataObject>;
  abstract set comments(comments: Array<CommentDataObject>);

  abstract get departmentSpecifics(): Array<DepartmentEntrySpecificsDataObject>;
  abstract set departmentSpecifics(departmentSpecifics: Array<DepartmentEntrySpecificsDataObject>);

  public static init(): EntryDataObject {
    return {
      "_id": undefined,
      "name": "",
      "description": "",
      "contact": "",
      "email": "",
      "relatedDepartments": undefined,
      "relatedEntries": undefined,
      "synonyms": undefined,
      "acronyms": undefined,
      "attachments": undefined,
      "comments": undefined,
      "departmentSpecifics": undefined
    }
  }

}
