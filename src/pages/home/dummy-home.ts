import { SuperLoginClientDoneResponse } from "../../providers/super_login_client/super_login_client_done_reponse";
import { SuperLoginClientErrorResponse } from "../../providers/super_login_client/super_login_client_error_reponse";
import { DepartmentDataobject } from "../../providers/dataobjects/department.dataobject";
import { DepartmentFilterDataobject } from "../../providers/dataobjects/department-filter.dataobject";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { HomePageModelInterface } from "./home.model-interface";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class HomePageModelDummy implements HomePageModelInterface {

  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  }

  public logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void {
    done();
  }

  public getAllDepartments(): Array<DepartmentDataobject> {
    let departments: Array<DepartmentDataobject> = [
      { departmentId: 1, departmentName: "Management" }, { departmentId: 2, departmentName: "Marketing" }, { departmentId: 3, departmentName: "Production" }
    ];
    return departments;
  };

  public getListings(currentLanguage: LanguageDataobject, departmentId?: number): number {
    return departmentId ? departmentId * 10 + 13 : 42;
  };

  public getDepartmentFilter(): Array<DepartmentFilterDataobject> {
    let filter: Array<DepartmentFilterDataobject> = [
      { departmentId: 1, filtered: true },
      { departmentId: 2, filtered: true },
      { departmentId: 3, filtered: true }
    ];
    return filter;
  };

  public getCurrentLanguage(): LanguageDataobject {
    let currentLanguage: LanguageDataobject = { languageId: 0, languageName: "English" }
    return;
  };

  ////////////////////////////////////////////Properties/////////////////////////////////////////////

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {

  }
}
