import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SuperLoginClientDatabaseInitializer} from "../super_login_client/super_login_client_database_initializer";

@Injectable()
export class ModelProvider extends SuperLoginClientDatabaseInitializer {

  constructor() {
    super();
    console.log('Hello ModelProvider Provider');
  }


  public initializeDatabases(user_databases: any): void {
    //TODO: lade alle Datenbanken
  }
}
