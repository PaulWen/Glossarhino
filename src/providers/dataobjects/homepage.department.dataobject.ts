import {DepartmentDataobject} from "./department.dataobject";

export abstract class HomePageDepartmentDataobject extends DepartmentDataobject {

    abstract get countOfEntries(): number;

}
