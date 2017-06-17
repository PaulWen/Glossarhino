import {HomePageInterface} from "./home-interface";
import {SuperLoginClientErrorResponse} from "../../providers/super_login_client/super_login_client_error_reponse";
import {SuperLoginClientDoneResponse} from "../../providers/super_login_client/super_login_client_done_reponse";
import {Promise} from "es6-promise";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyHome implements HomePageInterface {

  public isAuthenticated(): Promise<boolean>|boolean {
    return true;
  }

  public logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void {
    done();
  }

  public getAllDepartments(): Array<number> {
        let departments: Array<number> = [1, 2, 3];
        return departments;
  };

  public getListings(departmentId?: number): number {
      return 42;
  };

  public getFilter(): Array<boolean> {
      let filter: Array<boolean> = [];
      filter[1] = true;
      filter[2] = false;
      filter[3] = true;

      return filter;
  };

  public getLanguage() {
      return "";
  };

}
