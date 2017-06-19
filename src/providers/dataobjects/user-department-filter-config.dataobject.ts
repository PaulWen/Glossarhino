import {DepartmentFilterDataobject} from "./department-filter.dataobject";

export abstract class UserDepartmentFilterConfigDataobject {


  abstract get departmentFilterConfig(): Array<DepartmentFilterDataobject>;

}
