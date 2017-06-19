import {DepartmentDataobject} from "./department.dataobject";


export abstract class GlobalDepartmentConfigDataobject {

  abstract get departments(): Array<DepartmentDataobject>;

}
