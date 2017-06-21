import {Injectable} from "@angular/core";
import PouchDB from "pouchdb";
import "rxjs/add/operator/map";
import {AppConfig} from "../app/app-config";
import {Logger} from "../app/logger";
import {HomePageModelInterface} from "../pages/home/home.model-interface";
import {LoginPageInterface} from "../pages/login/login-interface";
import {DepartmentFilterDataobject} from "./dataobjects/department-filter.dataobject";
import {DepartmentDataobject} from "./dataobjects/department.dataobject";
import {GlobalDepartmentConfigDataobject} from "./dataobjects/global-department-config.dataobject";
import {GlobalLanguageConfigDataobject} from "./dataobjects/global-language-config.dataobject";
import {LanguageDataobject} from "./dataobjects/language.dataobject";
import {UserDepartmentFilterConfigDataobject} from "./dataobjects/user-department-filter-config.dataobject";
import {UserLanguageFilterConfigDataobject} from "./dataobjects/user-language-filter-config.dataobject";
import {SuperLoginClient} from "./super_login_client/super_login_client";
import {SuperloginHttpRequester} from "./super_login_client/superlogin_http_requester";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  //////////////Databases////////////
  /** all the databases for the different languages <Key: Language, Value: PouchDB database object>  */
  private entryDatabases: Map<number, any>;

  /** database that stores all the settings of the currently logged-in user*/
  private userSettingsDatabase: any;


  //////////////Global App Settings////////////
  private globalDepartmentConfig: GlobalDepartmentConfigDataobject;
  private globalLanguageConfig: GlobalLanguageConfigDataobject;

  //////////////Local App Settings////////////
  private userDepartmentFilters: UserDepartmentFilterConfigDataobject;
  private userLanguageFilters: UserLanguageFilterConfigDataobject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequester: SuperloginHttpRequester) {
    super(httpRequester);

    this.entryDatabases = new Map<number, any>();
    this.userSettingsDatabase = null;

    this.globalDepartmentConfig = null;
    this.globalLanguageConfig = null;
  }

  ////////////////////////////////////////Inherited Methods//////////////////////////////////////////

  //////////////////////////////////////////
  //            Shared Methods            //
  //////////////////////////////////////////

  public async getAllDepartments(): Promise<Array<DepartmentDataobject>> {
    let departments: Array<DepartmentDataobject>;
    departments = [
      {departmentId: 1, departmentName: "Management"}, {
        departmentId: 2,
        departmentName: "Marketing"
      }, {departmentId: 3, departmentName: "Production"}
    ];

    let currentTime = new Date().getTime();

    while (currentTime + 10000 >= new Date().getTime()) {
    }


    return departments;
  };

  public async getDepartmentFilter(): Promise<Array<DepartmentFilterDataobject>> {
    let filter: Array<DepartmentFilterDataobject> = [
      {departmentId: 1, filtered: true},
      {departmentId: 2, filtered: true},
      {departmentId: 3, filtered: true}
    ];
    return filter;
  };

  public async getCurrentLanguage(): Promise<LanguageDataobject> {
    let currentLanguage: LanguageDataobject = {languageId: 0, languageName: "English"};
    let promise = new Promise<LanguageDataobject>((resolve, reject) => {
      resolve(currentLanguage);
    });
    return promise;
  };

  //////////////////////////////////////////
  //      SuperLoginClient Methods        //
  //////////////////////////////////////////

  public initializeDatabases(user_databases: any): void {
    Logger.log(user_databases);

    // initialize settings database
    this.userSettingsDatabase = this.initializeDatabase("settings", user_databases.settings);

    // load global app settings
    this.loadGlobalAppSettings(user_databases.application_settings).then(
      () => {
        // once the global app-settings have been loaded...
        // initialize all the entry databases from the different languages
        for (let language of this.globalLanguageConfig.languages) {
          this.entryDatabases.set(language.languageId, this.initializeDatabase("language_" + language.languageId, user_databases["language_" + language.languageId]));
        }
      }, (error) => {
        Logger.error(error);
      }
    );

    // load user app settings
    this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS).then(
      (data: UserDepartmentFilterConfigDataobject)=>{
        this.userDepartmentFilters = data;
      }, (error)=>{
        Logger.error(error);
      }
    );
    this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS).then(
      (data: UserLanguageFilterConfigDataobject)=>{
        this.userLanguageFilters = data;
      }, (error)=>{
        Logger.error(error);
      }
    );
  };


  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public async getListings(currentLanguageId: number, departmentId?: number): Promise<number> {
    Logger.log(currentLanguageId + departmentId);
    return 42;
  };

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  //////////////////////////////////////////
  //      FilterModalInterface Methods    //
  //////////////////////////////////////////

  public setDepartmentFilter(departmentFilter: Array<DepartmentFilterDataobject>) {
  };

  //////////////////////////////////////////
  //       EditModalInterface Methods     //
  //////////////////////////////////////////

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //         PouchDB Helper-Methods       //
  //////////////////////////////////////////

  /**
   * This function initializes the PouchDB database objects needed to build up a
   * connection to the CouchDB database. The local and the remote database get synced
   * in real-time.
   *
   * This function can also be used to change the URL of the database if necessary.
   *
   * @param databaseName name of the database
   * @param url to the CouchDB database
   */
  private initializeDatabase(databaseName: string, url: string): any {
    // create PouchDB database objects
    let remoteDatabase: any = new PouchDB(url);
    let database: any = new PouchDB(databaseName);

    // sync the local and the remote database
    database.sync(remoteDatabase, {
      live: true, // sync in real-time
      retry: true
    }).on("error", function (error) {
      Logger.error(error);
      return null;
    });

    return database;
  }


  /**
   * This method returns an document with a specific id.
   *
   * @param pouchDb the database from where the document should be loaded
   * @param id the id of the wanted document
   *
   * @return the wanted document or null if the documented got already deleted or an error occurred
   */
  private async getDocumentAsJSON(pouchDb: any, id: string): Promise<any> {
    try {
      // load the wanted document from the database and save it in the right DocumentType
      return await pouchDb.get(id);
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }


  /**
   * This function creates an new document from the type <DocumentType> in the database.
   *
   * @param pouchDb the database from where the document should be loaded
   * @param data that should be included in the new document
   *
   * @return {Promise<boolean>} true if the operation was successfully or false in the case of an error
   */
  private async newDocument(pouchDb: any, data: any): Promise<boolean> {
    try {
      // upload the data as a new document
      await pouchDb.post(data);
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }


  // /**
  //  * This function returns all the documents included in the database listed in an array.
  //  *
  //  * @return all the documents included in the database listed in an array or null if an error occurred
  //  */
  // private async getAllDocuments(): Promise<DocumentType[]> {
  //   try {
  //     let documentList: DocumentType[] = [];
  //
  //     // load all the documents from the database
  //     let databaseResponse = await this.database.allDocs({
  //       include_docs: true,
  //       attachments: false
  //     });
  //
  //     // put all the documents in a typed array
  //     for (let i: number = 0; i < databaseResponse.rows.length; i++) {
  //       documentList[i] = new this.documentCreator(databaseResponse.rows[i].doc, this);
  //     }
  //
  //     // return all the documents in an array
  //     return documentList;
  //   } catch (error) {
  //     Logger.error(error);
  //     return null;
  //   }
  // }

  /**
   * This method loads a document in the database.
   *
   * @param pouchDb the PouchDB database from where the document should be loaded
   * @param json the document, which should get loaded in the database,  as an json object
   *
   * @return {Promise<boolean>} true if the operation was successfully or false in the case of an error
   */
  private async putDocument(pouchDb: any, json: any): Promise<boolean> {
    try {
      // upload the document
      await pouchDb.put(json);
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  //////////////////////////////////////////
  //            Other Methods             //
  //////////////////////////////////////////

  /**
   * This method loads all the global app settings from the database and stores them locally in this class.
   *
   * @param globalAppSettingsDbUrl is the URL to the remote global app settings DB
   * @return {Promise<boolean>} true if the operation was successfully or false in the case of an error
   */
  private async loadGlobalAppSettings(globalAppSettingsDbUrl: string): Promise<boolean> {
    // get a global app setting database reference
    let globalAppSettingsDb = new PouchDB(globalAppSettingsDbUrl);

    // load the necessary data
    try {
      // load departments
      this.globalDepartmentConfig = <GlobalDepartmentConfigDataobject> await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_DEPARTMENTS);

      // load languages
      this.globalDepartmentConfig = <GlobalDepartmentConfigDataobject> await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_LANGUAGES);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}
