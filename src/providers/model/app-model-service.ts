import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SuperLoginClientDatabaseInitializer} from "../super_login_client/super_login_client_database_initializer";
import {SuperLoginClient} from "../super_login_client/super_login_client";
import {Logger} from "../../app/logger";

@Injectable()
export class AppModelService implements SuperLoginClientDatabaseInitializer {
////////////////////////////////////////////Properties////////////////////////////////////////////

  private superLoginClient: SuperLoginClient;

////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(superLoginClient: SuperLoginClient) {
    this.superLoginClient = superLoginClient;

    // register this class as the SuperLoginClientDatabaseInitializer
    this.superLoginClient.databaseInitializer = this;

    Logger.log('Hello AppModelService Provider');
  }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

  public initializeDatabases(user_databases: any): void {
    //TODO: lade alle Datenbanken
    Logger.log(user_databases);
  }

}
