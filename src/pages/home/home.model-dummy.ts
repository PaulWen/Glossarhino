import { SuperLoginClientDoneResponse } from "../../providers/super_login_client/super_login_client_done_reponse";
import { SuperLoginClientErrorResponse } from "../../providers/super_login_client/super_login_client_error_reponse";
import { LanguageDataobject } from "../../providers/dataobjects/language.dataobject";
import { HomePageModelInterface } from "./home.model-interface";
import { HomePageDepartmentDataobject } from "../../providers/dataobjects/homepage.department.dataobject";

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

  public async getAllDepartments(): Promise<Array<HomePageDepartmentDataobject>> {
    let departments: Array<HomePageDepartmentDataobject>
    departments = [
      {
        departmentId: 1,
        departmentName: "Management",
        departmentFilter: [],
        departmentListings: 42
      }, {
        departmentId: 2,
        departmentName: "Marketing",
        departmentFilter: [],
        departmentListings: 56
      }, {
        departmentId: 3,
        departmentName: "Production",
        departmentFilter: [],
        departmentListings: 69
      }
    ];

    return departments;
  };

  public async getListings(currentLanguageId: number, departmentId?: number): Promise<number> {
    return departmentId ? departmentId * 10 + 13 : 42;
  };

  public async getAllListings(currentLanguageId: number): Promise<number> {
    return 102;
  }

  public async getCurrentLanguage(): Promise<LanguageDataobject> {
    let currentLanguage: LanguageDataobject = { languageId: 0, languageName: "English" }
    return currentLanguage;
  };

  ////////////////////////////////////////////Properties/////////////////////////////////////////////

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor() {

  }
}
