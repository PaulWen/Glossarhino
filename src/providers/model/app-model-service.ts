import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SuperLoginClient} from "../super_login_client/super_login_client";
import {Logger} from "../../app/logger";
import {SuperloginHttpRequestor} from "../super_login_client/superlogin_http_requestor";

@Injectable()
export class AppModelService extends SuperLoginClient {
////////////////////////////////////////////Properties////////////////////////////////////////////


////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequestor: SuperloginHttpRequestor) {
    super(httpRequestor);
    Logger.log('Hello AppModelService Provider');
  }

////////////////////////////////////////Inherited Methods//////////////////////////////////////////

  public initializeDatabases(user_databases: any): void {
    //TODO: lade alle Datenbanken
    Logger.debug("Datenbanken:");
    Logger.log(user_databases);
  }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

}
