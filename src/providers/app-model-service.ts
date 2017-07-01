import {Injectable} from "@angular/core";
import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
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
      this.addNameListIndices(languageDatabase);
    }

    return true;
  }


  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public async getCountOfAllEntries(currentLanguageId: number): Promise<number> {
    let result: any = (await this.entryDatabases.get(currentLanguageId).query(AppConfig.NAME_LIST_INDEX_PREFIX + "all", {
      reduce: true
    })).rows[0].value;

    // return the number of entries that are available in the current language
    return result;
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

  public async getEntryListPageEntryDataObjects(searchString: string, selectedLanguage: number, departmentId?: number): Promise<Array<EntryListPageEntryDataObject>> {
    // initialize data structure which will be returned
    let entryNames: Array<string> = [];

    // load data from database
    try {
      let selector: any = {};

      // search only for entries where the name includes the search string (based on a regular expression in order to make it case insensitive)
      let regexp = new RegExp(searchString ? searchString : "", "i");
      selector.name = {$regex: regexp};

      // if departmentId is defined search only for entries that are relevant for the specific department
      if (departmentId != undefined) {
        selector.relatedDepartments = {
          $in: [departmentId]
        };
      }

      let result: any = await this.entryDatabases.get(selectedLanguage).find({
        selector: selector, fields: ["_id", "name", "synonyms", "acronyms"]
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
      return await this.getDocumentAsJSON(this.entryDatabases.get(languageId), _id);
    } catch (error) {
      Logger.error(error);
    }

    return null;
  };

  public getDepartmentById(departmentId: number): DepartmentDataObject {
    return GlobalDepartmentConfigDataObject.getDepartmentById(this.globalDepartmentConfig, departmentId);
  }

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
    return (await this.userSettingsDatabase.put(userDepartmentFilterConfigDataObject)
    ).ok;
  };

  //////////////////////////////////////////
  //       EditModalInterface Methods     //
  //////////////////////////////////////////

  public async setEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<boolean> {
    try {
      return (await this.entryDatabases.get(languageId).put(entryDataObject)
      ).ok;
    } catch (error) {
      Logger.error(error);
    }

    return false;
  }

  public async newEntryDataObject(entryDataObject: EntryDataObject, languageId: number): Promise<String> {
    try {
      return (await this.entryDatabases.get(languageId).post(entryDataObject)
      ).id;
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
    };
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
  }

  /**
   * This function adds the indices for searching an database of entries by name, acronyms and synonyms.
   * In order to allow a search only for entries that are related to a specific department many indices get created:
   *  1) one index for searching all entries by name, acronyms and synonyms
   *  2) one index for each department to search for all entries that are related to a specific department by name, acronyms and synonyms
   *
   * Before the function adds any index it checks if the database already has the specific index.
   *
   * The name under which the indices can be referenced for querying is:
   *  index for searching all entries: "name_list_index_all"
   *  index for searching entries related to a specific department: "name_list_index_XX" (XX = ID of department)
   */
  private addNameListIndices(database: any) {
    ///////////////////////////////////////////////////////////////////////////
    // 1) add index for searching all entries by name, acronyms and synonyms //
    ///////////////////////////////////////////////////////////////////////////
    let indexName = AppConfig.NAME_LIST_INDEX_PREFIX + "all";

    // check if the database already has the index set up
    database.get("_design/" + indexName).then(
      (data: any) => {
        // if the index could be loaded it exists and does not have to created
        Logger.debug("Index does not have to be crated! It already exists!");
        return;
      }, (error: any) => {
        switch (error.status) {
          case 404:
            Logger.debug("Index has to be crated! It does not yet exist!");

            // if the index does not yet exists it has to be created
            let indexViewObject = {};
            indexViewObject[indexName] = {
              "map": "function (doc) {\r\n  if (doc.name && doc._id && doc.acronyms && doc.synonyms) {\r\n    // value\r\n    var value = {\r\n      \"_id\": doc._id,\r\n      \"name\": doc.name,\r\n      \"synonyms\": doc.synonyms,\r\n      \"acronyms\": doc.acronyms\r\n    };\r\n\r\n    // emit the document for the name, every acronym and every synonym as keys  \r\n    emit(doc.name.toLowerCase(), value);\r\n\r\n    var arrayLengthAcronyms = doc.acronyms.length;\r\n    for (var i = 0; i < arrayLengthAcronyms; i++) {\r\n      emit(doc.acronyms[i].toLowerCase(), value);\r\n    }\r\n\r\n    var arrayLengthSynonyms = doc.synonyms.length;\r\n    for (var i = 0; i < arrayLengthSynonyms; i++) {\r\n      emit(doc.synonyms[i].toLowerCase(), value);\r\n    }\r\n  }\r\n}",
              "reduce": "_count"
            };

            database.put(
              {
                "_id": "_design/" + indexName,
                "views": indexViewObject,
                "language": "javascript"
              }
            );

            break;
          default:
            throw error;
        }
      }
    );

    /////////////////////////////////////////////////////////////////////////
    // 2) add index for each department to search for all entries that are //
    //    related to a specific department by name, acronyms and synonyms  //
    /////////////////////////////////////////////////////////////////////////

    for (let department of this.globalDepartmentConfig.departments) {
      let indexName = AppConfig.NAME_LIST_INDEX_PREFIX + department.departmentId;

      // check if the database already has the index set up
      database.get("_design/" + indexName).then(
        (data: any) => {
          // if the index could be loaded it exists and does not have to created
          Logger.debug("Index does not have to be crated! It already exists!");
          return;
        }, (error: any) => {
          switch (error.status) {
            case 404:
              Logger.debug("Index has to be crated! It does not yet exist!");

              // if the index does not yet exists it has to be created
              let indexViewObject = {};
              indexViewObject[indexName] = {
                "map": "function (doc) {\r\n  if (doc.name && doc._id && doc.acronyms && doc.synonyms && doc.relatedDepartments) {\r\n    // check if the document is realted to the specific department for which entries should be find\r\n    var isRelatedToDepartment = false;\r\n    var arrayLengthRelatedDepartments = doc.relatedDepartments.length;\r\n    for (var i = 0; i < arrayLengthRelatedDepartments; i++) {\r\n      if (doc.relatedDepartments[i] == " + department.departmentId + ") {\r\n        isRelatedToDepartment = true;\r\n        break;\r\n      }\r\n    }\r\n\r\n    // only if the entry is realted to the specific department for which entries should be find emit it\r\n    if (isRelatedToDepartment) {\r\n      // value\r\n      var value = {\r\n        \"_id\": doc._id,\r\n        \"name\": doc.name,\r\n        \"synonyms\": doc.synonyms,\r\n        \"acronyms\": doc.acronyms\r\n      };\r\n\r\n      // emit the document for the name, every acronym and every synonym as keys  \r\n      emit(doc.name.toLowerCase(), value);\r\n\r\n      var arrayLengthAcronyms = doc.acronyms.length;\r\n      for (var i = 0; i < arrayLengthAcronyms; i++) {\r\n        emit(doc.acronyms[i].toLowerCase(), value);\r\n      }\r\n\r\n      var arrayLengthSynonyms = doc.synonyms.length;\r\n      for (var i = 0; i < arrayLengthSynonyms; i++) {\r\n        emit(doc.synonyms[i].toLowerCase(), value);\r\n      }\r\n    }\r\n  }\r\n}",
                "reduce": "_count"
              };

              database.put(
                {
                  "_id": "_design/" + indexName,
                  "views": indexViewObject,
                  "language": "javascript"
                }
              );

              break;
            default:
              throw error;
          }
        }
      );
    }
  }
}
