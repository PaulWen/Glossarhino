/**
 * DepartmentEntryDescriptionDataobject class for uage in model and controller. Class specifies departments
 */
export abstract class DepartmentEntrySpecificsDataObject {

  abstract get departmentId(): string;

  abstract get description(): string;
  abstract set description(description: string);

  abstract get contact(): string;
  abstract set contact(contact: string);

  abstract get email(): string;
  abstract set email(email: string);


  public static compare(departmentEntrySpecificsDataObject1: DepartmentEntrySpecificsDataObject, departmentEntrySpecificsDataObject2: DepartmentEntrySpecificsDataObject): number {
    if (departmentEntrySpecificsDataObject1.departmentId < departmentEntrySpecificsDataObject2.departmentId)
      return -1;
    if (departmentEntrySpecificsDataObject1.departmentId > departmentEntrySpecificsDataObject2.departmentId)
      return 1;
    return 0;
  }

  public static init(departmentId: string): DepartmentEntrySpecificsDataObject {
    return {
      "departmentId": departmentId,
      "description": "",
      "contact": "",
      "email": ""
    };
  }

}
