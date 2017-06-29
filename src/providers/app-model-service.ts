import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import "rxjs/add/operator/map";
import { AppConfig } from "../app/app-config";
import { Logger } from "../app/logger";
import { HomePageModelInterface } from "../pages/home/home.model-interface";
import { LanguagePopoverPageModelInterface } from "../pages/language-popover/language-popover.model-interface";
import { LoginPageInterface } from "../pages/login/login-interface";
import { GlobalDepartmentConfigDataObject } from "./dataobjects/global-department-config.dataobject";
import { GlobalLanguageConfigDataobject } from "./dataobjects/global-language-config.dataobject";
import { HomePageDepartmentDataobject } from "./dataobjects/homepage.department.dataobject";
import { UserDepartmentFilterConfigDataObject } from "./dataobjects/user-department-filter-config.dataobject";
import { UserLanguageFilterConfigDataObject } from "./dataobjects/user-language-filter-config.dataobject";
import { SuperLoginClient } from "./super_login_client/super_login_client";
import { SuperloginHttpRequester } from "./super_login_client/superlogin_http_requester";
import { EntryListPageModelInterface } from "../pages/entry-list/entry-list.model-interface";
import { EntryListPageEntryDataObject } from "./dataobjects/entrylistpage.entry.dataobject";
import { SingleEntryPageModelInterface } from "../pages/single-entry/single-entry.model-interface";
import { EntryDataObject } from "./dataobjects/entry.dataobject";
import { DepartmentDataObject } from "./dataobjects/department.dataobject";
import { UserSettingsPageModelInterface } from "../pages/user-settings/user-settings.model-interface";
import { EditModalPageModelInterface } from "../pages/edit-modal/edit-modal.model-interface";
import { UserDataObject } from "./dataobjects/user.dataobject";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface, LanguagePopoverPageModelInterface, EntryListPageModelInterface, SingleEntryPageModelInterface, UserSettingsPageModelInterface, EditModalPageModelInterface {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  //////////////Databases////////////
  /** all the databases for the different languages <Key: Language, Value: PouchDB database object>  */
  private entryDatabases: Map<number, any>;

  /** database that stores all the settings of the currently logged-in user*/
  private userSettingsDatabase: any;


  //////////////Global App Settings////////////
  private globalDepartmentConfig: GlobalDepartmentConfigDataObject;
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

  public async getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject> {
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
      //      languageDatabase.createIndex({
      //        index: {fields: ["name"]}
      //      });
    }

    return true;
  }


  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public async getCountOfAllEntries(currentLanguageId: number): Promise<number> {
    // load the IDs of all entries that are available in one language (before the _design docs)
    let result1: any = (await this.entryDatabases.get(currentLanguageId).allDocs({
      include_docs: true,
      attachments: false,
      endkey: '_design'
    })).rows;

    // load the IDs of all entries that are available in one language (after the _design docs)
    let result2: any = (await this.entryDatabases.get(currentLanguageId).allDocs({
      include_docs: true,
      attachments: false,
      startkey: '_design\uffff'
    })).rows;

    let result = result1.concat(result2);

    // return the number of entries that are available in the current language
    return result.length;
  }

  public async getSelectedHomePageDepartmentDataobjects(currentLanguageId: number): Promise<Array<HomePageDepartmentDataobject>> {
    // initialize data structure which will be returned
    let selectedHomePageDepartmentDataObjects: Array<HomePageDepartmentDataobject> = [];

    // load currently selected department
    let userDepartmentSetting = await this.getUserDepartmentFilterConfigDataObject();

    for (let departmentId of userDepartmentSetting.selectedDepartments) {
      try {
        let result: any = await this.entryDatabases.get(currentLanguageId).find({
          selector: {
            relatedDepartments: {
              $in: [departmentId]
            }
          }, fields: ["_id"]
        });

        // add result to the list of departments
        selectedHomePageDepartmentDataObjects.push(HomePageDepartmentDataobject.init(result.docs.length, GlobalDepartmentConfigDataObject.getDepartmentById(this.globalDepartmentConfig, departmentId)));

      } catch (error) {
        Logger.error(error);
      }
    }

    return selectedHomePageDepartmentDataObjects;
  }

  //////////////////////////////////////////
  //  EntryListPageModelInterface Method  //
  //////////////////////////////////////////

  public async getEntryNameList(searchString: string, selectedLanguage: number, departmentId?: number): Promise<Array<EntryListPageEntryDataObject>> {
    // initialize data structure which will be returned
    let entryNames: Array<string> = [];

    // load data from database
    try {
      let selector: any = {};

      // search only for entries where the name starts as the search string (based on a regular expression)
      let regexp = new RegExp(searchString ? searchString : "", 'i');
      selector.name = { $regex: regexp };

      // if departmentId is defined search only for entries that are relevant for the specific department
      if (departmentId != undefined) {
        selector.relatedDepartments = {
          $in: [departmentId]
        };
      }

      let result: any = await this.entryDatabases.get(selectedLanguage).find({
        selector: selector, fields: ["_id", "name"]
      });

      // return data
      return result.docs;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  public async getEntryDataObject(_id: string, languageId: number): Promise<EntryDataObject> {
    try {
      return await this.getDocumentAsJSON(this.entryDatabases.get(languageId),_id);
    } catch (error) {
      Logger.error(error);
    }

    return null;
  };

  public getDepartmentById (departmentId: number): DepartmentDataObject {
    return GlobalDepartmentConfigDataObject.getDepartmentById(this.globalDepartmentConfig, departmentId);
  }

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): GlobalLanguageConfigDataobject {
    return this.globalLanguageConfig;
  }

  public async setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataObject): Promise<boolean> {
    return (await this.userSettingsDatabase.put(userLanguageSetting)).ok;
  }

  //////////////////////////////////////////
  //UserSettingsPageModelInterface Methods//
  //////////////////////////////////////////

  public getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject {
    return this.globalDepartmentConfig;
  };

  /**
   * This function gets the current {@link UserDepartmentFilterConfigDataobject} of the user.
   * If it is not yet created in the database this function will create it.
   *
   * @return {Promise<UserDepartmentFilterConfigDataobject>}
   */
  public getUserDepartmentFilterConfigDataObject(): Promise<UserDepartmentFilterConfigDataObject> {
    return new Promise<UserDepartmentFilterConfigDataObject>((resolve, reject) => {
      this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS).then(
        (data: UserDepartmentFilterConfigDataObject) => {
          // if document could be loaded return it
          resolve(data);
        }, (error: any) => {
          switch (error.status) {
            case 404:
              // document has not yet been created and has to be created now
              try {
                // generate initial user department settings
                let initialUserDepartmentSettings: UserDepartmentFilterConfigDataObject = UserDepartmentFilterConfigDataObject.init(this.globalDepartmentConfig);

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
  };

  public async setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject): Promise<boolean> {
    return (await this.userSettingsDatabase.put(userDepartmentFilterConfigDataObject)).ok;
  };

  //////////////////////////////////////////
  //       EditModalInterface Methods     //
  //////////////////////////////////////////

  public async setEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<boolean> {
    try {
      return (await this.entryDatabases.get(languageId).put(entryDataObject)).ok;
    } catch (error) {
      Logger.error(error);
    }

    return false;
  }

  public async newEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<String> {
    try {
      return (await this.entryDatabases.get(languageId).post(entryDataObject)).id;
    } catch (error) {
      Logger.error(error);
    }

    return null;
  }

  //////////////////////////////////////////
  //    CommentModalInterface Methods     //
  //////////////////////////////////////////

  public getCurrentUser(): UserDataObject {
    return {
      "name": "Simon Weber",
      "email": "simon@dhbw-stuttgart.de"
    }
  }

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
    return await pouchDb.get(id, {
      attachments: false
    });
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
      this.globalDepartmentConfig = <GlobalDepartmentConfigDataObject>await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_DEPARTMENTS);

      // load languages
      this.globalLanguageConfig = <GlobalLanguageConfigDataobject>await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_LANGUAGES);

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
  private getUserLanguageFilterConfigDataobject(): Promise<UserLanguageFilterConfigDataObject> {
    return new Promise<UserLanguageFilterConfigDataObject>((resolve, reject) => {
      this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS).then(
        (data: UserLanguageFilterConfigDataObject) => {
          // if document could be loaded return it
          resolve(data);
        }, (error: any) => {
          switch (error.status) {
            case 404:
              // document has not yet been created and has to be created now
              try {
                // generate initial user department settings
                let initialUserLanguageSettings: UserLanguageFilterConfigDataObject = UserLanguageFilterConfigDataObject.init(this.globalLanguageConfig);

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
  };
}
