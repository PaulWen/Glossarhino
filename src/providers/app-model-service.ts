import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import PouchDB from "pouchdb";
import "rxjs/add/operator/map";
import {AppConfig} from "../app/app-config";
import {Logger} from "../app/logger";
import {CommentModalModelInterface} from "../pages/comment-modal/comment-modal.model-interface";
import {EditModalPageModelInterface} from "../pages/edit-modal/edit-modal.model-interface";
import {EntryListPageModelInterface} from "../pages/entry-list/entry-list.model-interface";
import {HomePageModelInterface} from "../pages/home/home.model-interface";
import {LanguagePopoverPageModelInterface} from "../pages/language-popover/language-popover.model-interface";
import {LinkedObjectsModalModelInterface} from "../pages/linked-objects-modal/linked-objects-modal.model-interface";
import {LoginPageInterface} from "../pages/login/login-interface";
import {SingleEntryPageModelInterface} from "../pages/single-entry/single-entry.model-interface";
import {DepartmentEntrySpecificsDataObject} from "./dataobjects/department-entry-description.dataobject";
import {DepartmentDataObject} from "./dataobjects/department.dataobject";
import {EntryDataObject} from "./dataobjects/entry.dataobject";
import {EntryListPageEntryDataObject} from "./dataobjects/entrylistpage.entry.dataobject";
import {GlobalDepartmentConfigDataObject} from "./dataobjects/global-department-config.dataobject";
import {GlobalLanguageConfigDataobject} from "./dataobjects/global-language-config.dataobject";
import {HomePageDepartmentDataobject} from "./dataobjects/homepage.department.dataobject";
import {UserDepartmentFilterConfigDataObject} from "./dataobjects/user-department-filter-config.dataobject";
import {UserLanguageFilterConfigDataObject} from "./dataobjects/user-language-filter-config.dataobject";
import {UserDataObject} from "./dataobjects/user.dataobject";
import {SuperLoginClient} from "./super_login_client/super_login_client";
import {SuperloginHttpRequester} from "./super_login_client/superlogin_http_requester";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface, LanguagePopoverPageModelInterface, EntryListPageModelInterface, SingleEntryPageModelInterface, EditModalPageModelInterface, CommentModalModelInterface, LinkedObjectsModalModelInterface {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  private platform: Platform;

  //////////////Databases////////////
  /** all the databases for the different languages <Key: Language, Value: PouchDB database object>  */
  private entryDatabases: Map<string, any>;

  /** database that stores all the settings of the currently logged-in user*/
  private userSettingsDatabase: any;

  /** database that stores all the global settings of the app*/
  private globalSettingsDatabase: any;

  //////////////Global App Settings////////////
  private globalDepartmentConfig: GlobalDepartmentConfigDataObject;
  private globalLanguageConfig: GlobalLanguageConfigDataobject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequester: SuperloginHttpRequester, platform: Platform) {
    super(httpRequester);

    this.platform = platform;

    // load necessary PouchDB Plugins
    PouchDB.plugin(require("pouchdb-find"));
    PouchDB.plugin(require("pouchdb-adapter-cordova-sqlite"));

    // initialize properties
    this.entryDatabases = new Map<string, any>();
    this.userSettingsDatabase = null;
    this.globalSettingsDatabase = null;

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

  public getGlobalDepartmentConfigDataObject(): GlobalDepartmentConfigDataObject {
    return this.globalDepartmentConfig;
  };

  public getDepartmentById(departmentId: string): DepartmentDataObject {
    return GlobalDepartmentConfigDataObject.getDepartmentById(this.globalDepartmentConfig, departmentId);
  }

  //////////////////////////////////////////
  //      SuperLoginClient Methods        //
  //////////////////////////////////////////

  public async initializeDatabases(user_databases: any): Promise<boolean> {
    Logger.log(user_databases);

    // initialize settings databases
    this.globalSettingsDatabase = this.initializeDatabase("global-settings", user_databases.application_settings);
    this.userSettingsDatabase = this.initializeDatabase("settings", user_databases.settings);

    // load global app settings
    await this.loadGlobalAppSettings();

    // once the global app-settings have been loaded...
    // initialize all the entry databases from the different languages
    for (let language of this.globalLanguageConfig.languages) {
      let languageDatabase = this.initializeDatabase("language_" + language.languageId, user_databases["language_" + language.languageId]);

      // add database to list of language databases
      this.entryDatabases.set(language.languageId, languageDatabase);
    }

    // register listener for closing all databases if the user closes the app
    window.addEventListener("beforeunload", this.closeDatabases);

    return true;
  }


  public destroyDatabases() {
    // destroy all language databases so that there is now content stored
    // on the client anymore
    this.entryDatabases.forEach((database: any) => {
      database.destroy();
    });

    // destroy the user settings database so that there is now content stored
    // on the client anymore
    this.userSettingsDatabase.destroy();

    // destroy the global settings database so that there is now content stored
    // on the client anymore
    this.globalSettingsDatabase.destroy();

    Logger.log("All database destroyed.");
  }

  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public async getCountOfAllEntries(currentLanguageId: string): Promise<number> {
    // load the IDs of all entries that are available in one language (before the _design docs)
    let result1: any = (await this.entryDatabases.get(currentLanguageId).allDocs({
        include_docs: true,
        attachments: false,
        endkey: "_design"
      })
    ).rows;

    // load the IDs of all entries that are available in one language (after the _design docs)
    let result2: any = (await this.entryDatabases.get(currentLanguageId).allDocs({
        include_docs: true,
        attachments: false,
        startkey: "_design\uffff"
      })
    ).rows;

    let result = result1.concat(result2);

    // return the number of entries that are available in the current language
    return result.length;
  }

  public async getSelectedHomePageDepartmentDataobjects(currentLanguageId: string): Promise<Array<HomePageDepartmentDataobject>> {
    // initialize data structure which will be returned
    let selectedHomePageDepartmentDataObjects: Array<HomePageDepartmentDataobject> = [];

    // load currently selected department
    let userDepartmentSetting = await this.getUserDepartmentFilterConfigDataObject();

    // load global department settings
    let globalDepartmentConfig = await this.getGlobalDepartmentConfigDataObject();

    for (let departmentId of userDepartmentSetting.selectedDepartments) {
      let result: any = await this.entryDatabases.get(currentLanguageId).find({
        selector: {
          relatedDepartments: {
            $in: [departmentId]
          }
        }, fields: ["_id"]
      });

      // add result to the list of departments
      selectedHomePageDepartmentDataObjects.push(HomePageDepartmentDataobject.init(result.docs.length, GlobalDepartmentConfigDataObject.getDepartmentById(globalDepartmentConfig, departmentId)));
    }

    return selectedHomePageDepartmentDataObjects;
  }

  //////////////////////////////////////////
  //  EntryListPageModelInterface Method  //
  //////////////////////////////////////////

  public async getEntryListPageEntryDataObjects(searchString: string, selectedLanguage: string, departmentId?: string): Promise<Array<EntryListPageEntryDataObject>> {
    // initialize data structure which will be returned
    let entryNames: Array<string> = [];

    // load data from database
    let selector: any = {};

    // search only for entries where the name, acronyms or synonyms include the search string (based on a regular expression in order to make it case insensitive)
    let regexp = new RegExp(searchString ? searchString : "", "i");
    selector["$or"] = [
      {name: {$regex: regexp}},
      {synonyms: {$regex: regexp}},
      {acronyms: {$regex: regexp}}
    ];

    // if departmentId is defined search only for entries that are relevant for the specific department
    if (departmentId != undefined && departmentId != "undefined") {
      selector.relatedDepartments = {
        $in: [departmentId]
      };
    }

    let result: Array<EntryListPageEntryDataObject> = (await this.entryDatabases.get(selectedLanguage).find({
        selector: selector, fields: ["_id", "name", "synonyms", "acronyms"]
      })
    ).docs;

    // order data
    result.sort(EntryListPageEntryDataObject.compare);

    // return data
    return result;
  }

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  public async getEntryDataObjectToShow(_id: string, languageId: string): Promise<EntryDataObject> {
    // loead data
    let result: EntryDataObject = await this.getDocumentAsJSON(this.entryDatabases.get(languageId), _id);
    let selectedDepartments: UserDepartmentFilterConfigDataObject = await this.getUserDepartmentFilterConfigDataObject();

    // create a new array of department specifics which does only include the department specifics which the user wants to see
    let newDepartmentSpecifics: Array<DepartmentEntrySpecificsDataObject> = [];
    for (let departmentSpecifics of result.departmentSpecifics) {
      // check if the department is currently selected by the user
      if (UserDepartmentFilterConfigDataObject.isDepartmentSelected(selectedDepartments, departmentSpecifics.departmentId)) {
        // if the department is selected by the user the department has to be added to the new array
        newDepartmentSpecifics.push(departmentSpecifics);
      }
    }
    // update the result
    result.departmentSpecifics = newDepartmentSpecifics;

    return result;
  };

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): GlobalLanguageConfigDataobject {
    return this.globalLanguageConfig;
  }

  public async setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataObject): Promise<boolean> {
    return (await this.userSettingsDatabase.put(userLanguageSetting)
    ).ok;
  }

  //////////////////////////////////////////
  //UserSettingsPageModelInterface Methods//
  //////////////////////////////////////////

  /**
   * This function gets the current {@link UserDepartmentFilterConfigDataObject} of the user.
   * If it is not yet created in the database this function will create it.
   *
   * @return {Promise<UserDepartmentFilterConfigDataObject>}
   */
  public async getUserDepartmentFilterConfigDataObject(): Promise<UserDepartmentFilterConfigDataObject> {
    try {
      // try to load the document that contains the settings of the user
      return await this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS);
    } catch (error) {
      switch (error.status) {
        case 404:
          // generate initial user department settings and store them in the database
          await this.userSettingsDatabase.put(UserDepartmentFilterConfigDataObject.init(this.getGlobalDepartmentConfigDataObject()));

          // try to load the complete document again
          return await this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS);
        default:
          throw error;
      }
    }
  }

  public async setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject): Promise<boolean> {
    return (await this.userSettingsDatabase.put(userDepartmentFilterConfigDataObject)
    ).ok;
  }

  //////////////////////////////////////////
  //       EditModalInterface Methods     //
  //////////////////////////////////////////

  public async getCompleteEntryDataObject(_id: string, languageId: string): Promise<EntryDataObject> {
    // load data
    return await this.getDocumentAsJSON(this.entryDatabases.get(languageId), _id);
  };


  public async setEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<boolean> {
    return (await this.entryDatabases.get(languageId).put(entryDataObject)
    ).ok;
  }

  public async newEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<String> {
    return (await this.entryDatabases.get(languageId).post(entryDataObject)
    ).id;
  }

  public async removeEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<boolean> {
    return (await this.entryDatabases.get(languageId).remove(entryDataObject)
    ).ok;
  }

  //////////////////////////////////////////
  //    CommentModalInterface Methods     //
  //////////////////////////////////////////

  public async getCurrentUser(): Promise<UserDataObject> {
    return this.getUserData();
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
    // if the app runs in the context of an cordova application
    // all databases should be created and stored using SQLlite
    // in order to have the data stored persistently
    if (this.platform.is("cordova")) {
      // create PouchDB database objects
      let remoteDatabase: any = new PouchDB(url);
      let database: any = new PouchDB(databaseName, {adapter: "cordova-sqlite"});

      // sync the local and the remote database
      database.sync(remoteDatabase, {
        live: true, // sync in real-time
        retry: true
      }).on("error", function (error) {
        Logger.error(error);
      }).on("paused", function (err) {
        Logger.log("Paused-Event-" + databaseName);
      });

      return database;

      // if the app runs in a browser as a web app...
    } else {
      // create PouchDB database objects using the default method
      let remoteDatabase: any = new PouchDB(url);
      let database: any = new PouchDB(databaseName);

      // sync the local and the remote database
      database.sync(remoteDatabase, {
        live: true, // sync in real-time
        retry: true
      }).on("error", function (error) {
        Logger.error(error);
      }).on("paused", function (err) {
        Logger.log("Paused-Event-" + databaseName);
      });

      return database;
    }
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
   * This function can be called to close all databases.
   * This function should be called if the user closes the app/browser permanently.
   */
  private closeDatabases() {
    // close all language databases so that there is now content stored
    // on the client anymore
    this.entryDatabases.forEach((database: any) => {
      database.close();
    });

    // close the user settings database so that there is now content stored
    // on the client anymore
    this.userSettingsDatabase.close();

    // close the global settings database so that there is now content stored
    // on the client anymore
    this.globalSettingsDatabase.close();

    Logger.log("All database closed.");
  }

  /**
   * This method loads all the global app settings from the database and stores them locally in this class.
   *
   * @return {Promise<boolean>} true if the operation was successfully or throws an error in the case of an error
   */
  private async loadGlobalAppSettings(): Promise<boolean> {
    // load the necessary data
    // load departments
    this.globalDepartmentConfig = <GlobalDepartmentConfigDataObject>await this.getDocumentAsJSON(this.globalSettingsDatabase, AppConfig.GLOBAL_APP_SETTINGS_DEPARTMENTS);

    // load languages
    this.globalLanguageConfig = <GlobalLanguageConfigDataobject>await this.getDocumentAsJSON(this.globalSettingsDatabase, AppConfig.GLOBAL_APP_SETTINGS_LANGUAGES);

    // register change listener to get informed as soon as the global application settings change
    this.globalSettingsDatabase.changes({
      since: 'now',
      live: true,
      include_docs: false
    }).on('change', function(change) {
      // load global app setting again
      this.loadGlobalAppSettings();
    }).on('error', function (error) {
      throw error;
    });

    Logger.log("Global App Settings have been loaded successfully.");

    return true;
  }

  /**
   * This function gets the current {@link UserLanguageFilterConfigDataObject} of the user.
   * If it is not yet created in the database this function will create it.
   *
   * @return {Promise<UserLanguageFilterConfigDataObject>}
   */
  public async getUserLanguageFilterConfigDataobject(): Promise<UserLanguageFilterConfigDataObject> {
    try {
      // try to load the document that contains the settings of the user
      return await this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS);
    } catch (error) {
      switch (error.status) {
        case 404:
          // generate initial user language settings and store them in the database
          await this.userSettingsDatabase.put(UserLanguageFilterConfigDataObject.init(this.getAllLanguages()));

          // try to load the complete document again
          return await this.getDocumentAsJSON(this.userSettingsDatabase, AppConfig.USER_APP_SETTINGS_LANGUAGE_FILTERS);
        default:
          throw error;
      }
    }
  }
}
