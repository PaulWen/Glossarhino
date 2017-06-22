import {DepartmentEntryDescriptionDataobject} from "./department-entry-description.dataobject";
import { AttachmentDataobject } from "./attachment.dataobject";

/**
 * EntryDataobject class for usage in model and controller. Class defines how entries should be specified
 */
export abstract class EntryDataobject {
  abstract get _id(): string;

  abstract get name(): string;
  abstract set name(name: string);

  abstract get description(): string;
  abstract set description(description: string);

  abstract get relatedDepartments(): Array<number>;

  abstract get attachments(): Array<AttachmentDataobject>;

  abstract get departmentSpecifics(): Array<DepartmentEntryDescriptionDataobject>;
}
