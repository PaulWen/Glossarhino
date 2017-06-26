/**
 * DepartmentEntryDescriptionDataobject class for uage in model and controller. Class specifies departments
 */
export abstract class DepartmentEntrySpecificsDataObject {

  abstract get departmentId(): number;

  abstract get description(): string;
  abstract set description(description: string);

  abstract get contact(): string;
  abstract set contact(contact: string);

  abstract get email(): string;
  abstract set email(email: string);

  public static init(departmentId: number): DepartmentEntrySpecificsDataObject {
    return {
      "departmentId": departmentId,
      "description": "",
      "contact": "",
      "email": ""
    }
  }

}
