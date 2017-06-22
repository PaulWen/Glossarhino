import {Injectable} from "@angular/core";
import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import "rxjs/add/operator/map";
import {AppConfig} from "../app/app-config";
import {Logger} from "../app/logger";
import {HomePageModelInterface} from "../pages/home/home.model-interface";
import {LanguagePopoverPageModelInterface} from "../pages/language-popover/language-popover.model-interface";
import {LoginPageInterface} from "../pages/login/login-interface";
import {GlobalDepartmentConfigDataobject} from "./dataobjects/global-department-config.dataobject";
import {GlobalLanguageConfigDataobject} from "./dataobjects/global-language-config.dataobject";
import {HomePageDepartmentDataobject} from "./dataobjects/homepage.department.dataobject";
import {UserDepartmentFilterConfigDataobject} from "./dataobjects/user-department-filter-config.dataobject";
import {UserLanguageFilterConfigDataobject} from "./dataobjects/user-language-filter-config.dataobject";
import {SuperLoginClient} from "./super_login_client/super_login_client";
import {SuperloginHttpRequester} from "./super_login_client/superlogin_http_requester";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface, LanguagePopoverPageModelInterface {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  //////////////Databases////////////
  /** all the databases for the different languages <Key: Language, Value: PouchDB database object>  */
  private entryDatabases: Map<number, any>;

  /** database that stores all the settings of the currently logged-in user*/
  private userSettingsDatabase: any;


  //////////////Global App Settings////////////
  private globalDepartmentConfig: GlobalDepartmentConfigDataobject;
  private globalLanguageConfig: GlobalLanguageConfigDataobject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequester: SuperloginHttpRequester) {
    super(httpRequester);

    // load necessary PouchDB Plugins
    PouchDB.plugin(PouchFind);

    // initialize properties
    this.entryDatabases = new Map<number, any>();
    this.userSettingsDatabase = null;

    this.globalDepartmentConfig = null;
    this.globalLanguageConfig = null;
  }

  ////////////////////////////////////////Inherited Methods//////////////////////////////////////////

  //////////////////////////////////////////
  //            Shared Methods            //
  //////////////////////////////////////////

  public async getSelectedLanguage(): Promise<UserLanguageFilterConfigDataobject> {
    return await this.getUserLanguageFilterConfigDataobject();
  }

  //////////////////////////////////////////
  //      SuperLoginClient Methods        //
  //////////////////////////////////////////

  public async initializeDatabases(user_databases: any): Promise<boolean> {
    Logger.log(user_databases);

    // initialize settings database
    this.userSettingsDatabase = this.initializeDatabase("settings", user_databases.settings);

    // load global app settings
    await this.loadGlobalAppSettings(user_databases.application_settings);

    // once the global app-settings have been loaded...
    // initialize all the entry databases from the different languages
    for (let language of this.globalLanguageConfig.languages) {
      let languageDatabase = this.initializeDatabase("language_" + language.languageId, user_databases["language_" + language.languageId]);

      // add database to list of language databases
      this.entryDatabases.set(language.languageId, languageDatabase);

      // set indexes of language database for faster search
      languageDatabase.createIndex({
        index: {fields: ["name"]}
      });
    }

    return true;
  }


  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public async getCountOfAllEntries(currentLanguageId: number): Promise<number> {
    // load the IDs of all entries that are available in one language
    let result: any = await this.entryDatabases.get(currentLanguageId).allDocs({
      include_docs: true,
      attachments: false,
      startkey: '_design\uffff'
    });

    // return the number of entries that are available in the current language
    return result.rows.length;
  }

  public async getSelectedHomePageDepartmentDataobjects(currentLanguageId: number): Promise<Array<HomePageDepartmentDataobject>> {
    // initialize data structure which will be returned
    let selectedHomePageDepartmentDataObjects: Array<HomePageDepartmentDataobject> = [];

    // load currently selected department
    let userDepartmentSetting = await this.getUserDepartmentFilterConfigDataobject();

    for (let departmentId of userDepartmentSetting.selectedDepartments) {
      try {
        let result: any = await this.entryDatabases.get(currentLanguageId).find({
          selector: {
            departments: {
              $elemMatch: {
                departmentId: {$eq: departmentId}
              }
            }
          }, fields: ["_id"]
        });

        // add result to the list of departments
        selectedHomePageDepartmentDataObjects.push(HomePageDepartmentDataobject.init(result.docs.length, GlobalDepartmentConfigDataobject.getDepartmentById(this.globalDepartmentConfig, departmentId)));

      } catch (error) {
        Logger.debug(error);
      }


    }

    return selectedHomePageDepartmentDataObjects;
  }

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): GlobalLanguageConfigDataobject {
    return this.globalLanguageConfig;
  }

  public setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataobject): Promise<UserLanguageFilterConfigDataobject> {
    return this.userSettingsDatabase.put(userLanguageSetting);
  }

//////////////////////////////////////////
  //      FilterModalInterface Methods    //
  //////////////////////////////////////////


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
   * @return a Promise which will eventually return the document or an error
   */
  private async getDocumentAsJSON(pouchDb: any, id: string): Promise<any> {
    // load the wanted document from the database and save it in the right DocumentType
    return await pouchDb.get(id);
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
      this.globalLanguageConfig = <GlobalLanguageConfigDataobject> await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_LANGUAGES);

      Logger.log("Global App Settings have been loaded successfully.");
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }


  /**
   * This function gets the current {@link UserLanguageFilterConfigDataobject} of the user.
   * If it is not yet created in the database this function will create it.
   *
   * @return {Promise<UserLanguageFilterConfigDataobject>}
   */
  private getUserLanguageFilterConfigDataobject(): Promise<UserLanguageFilterConfigDataobject> {
    return new Promise<UserLanguageFilterConfigDataobject>((resolve, reject) => {
        this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS).then(
          (data: UserLanguageFilterConfigDataobject) => {
            // if document could be loaded return it
            resolve(data);
          }, (error: any) => {
            switch (error.status) {
              case 404:
                // document has not yet been created and has to be created now
                try {
                  // generate initial user department settings
                  let initialUserLanguageSettings: UserLanguageFilterConfigDataobject = UserLanguageFilterConfigDataobject.init(this.globalLanguageConfig);

                  // create document
                  this.userSettingsDatabase.put(initialUserLanguageSettings).then((data) => {
                    // return newly created document as soon as it has been created
                    resolve(initialUserLanguageSettings);
                  }, (error) => {
                    reject(error);
                  });
                } catch (error) {
                  reject(error);
                }
                break;
              default:
                reject(error);
            }
          }
        );
      }
    );
  }


  /**
   * This function gets the current {@link UserDepartmentFilterConfigDataobject} of the user.
   * If it is not yet created in the database this function will create it.
   *
   * @return {Promise<UserDepartmentFilterConfigDataobject>}
   */
  private getUserDepartmentFilterConfigDataobject(): Promise<UserDepartmentFilterConfigDataobject> {
    return new Promise<UserDepartmentFilterConfigDataobject>((resolve, reject) => {
        this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS).then(
          (data: UserDepartmentFilterConfigDataobject) => {
            // if document could be loaded return it
            resolve(data);
          }, (error: any) => {
            switch (error.status) {
              case 404:
                // document has not yet been created and has to be created now
                try {
                  // generate initial user department settings
                  let initialUserDepartmentSettings: UserDepartmentFilterConfigDataobject = UserDepartmentFilterConfigDataobject.init(this.globalDepartmentConfig);

                  // create document
                  this.userSettingsDatabase.put(initialUserDepartmentSettings).then((data) => {
                    // return newly created document as soon as it has been created
                    resolve(initialUserDepartmentSettings);
                  }, (error) => {
                    reject(error);
                  });
                } catch (error) {
                  reject(error);
                }
                break;
              default:
                reject(error);
            }
          }
        );
      }
    );
  }
}
