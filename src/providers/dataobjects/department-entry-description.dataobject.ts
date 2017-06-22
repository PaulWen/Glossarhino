/**
 * DepartmentEntryDescriptionDataobject class for uage in model and controller. Class specifies departments
 */
export abstract class DepartmentEntryDescriptionDataobject {

  abstract get departmentId(): number;

  abstract get description(): string;
  abstract set description(description: string);

  abstract get name(): string;
  abstract set name(name: string);

  abstract get email(): string;
  abstract set email(email: string);

}
