import {DepartmentDataobject} from "./department.dataobject";
import { DepartmentFilterDataobject } from "./department-filter.dataobject";

export abstract class HomePageDepartmentDataobject extends DepartmentDataobject {

    abstract get listings(): number;

    abstract get filter(): boolean;

}
