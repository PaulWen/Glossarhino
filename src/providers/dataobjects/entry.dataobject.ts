import {DepartmentEntryDescriptionDataobject} from "./department-entry-description.dataobject";

/**
 * EntryDataobject class for usage in model and controller. Class defines how entries should be specified
 */
export abstract class EntryDataobject {
  abstract get _id(): string;

  abstract get name(): string;
  abstract set name(name: string);

  abstract get departments(): Array<DepartmentEntryDescriptionDataobject>;
}
