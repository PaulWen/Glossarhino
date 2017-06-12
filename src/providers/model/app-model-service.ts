import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SuperLoginClientDatabaseInitializer} from "../super_login_client/super_login_client_database_initializer";
import {SuperLoginClient} from "../super_login_client/super_login_client";

@Injectable()
export class AppModelService implements SuperLoginClientDatabaseInitializer {

  private superLoginClient: SuperLoginClient;

  constructor(superLoginClient: SuperLoginClient) {
    super();
    this.superLoginClient = superLoginClient;
    this.superLoginClient.databaseInitializer = this;

    console.log('Hello AppModelService Provider');
  }


  public initializeDatabases(user_databases: any): void {
    //TODO: lade alle Datenbanken
  }
}
