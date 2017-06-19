import {DepartmentFilterDataobject} from "./department-filter.dataobject";

export abstract class UserDepartmentFilterConfigDataobject {


  abstract get departmentFilters(): Array<DepartmentFilterDataobject>;

}
