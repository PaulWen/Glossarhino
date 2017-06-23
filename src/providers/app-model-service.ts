import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import "rxjs/add/operator/map";
import { AppConfig } from "../app/app-config";
import { Logger } from "../app/logger";
import { HomePageModelInterface } from "../pages/home/home.model-interface";
import { LanguagePopoverPageModelInterface } from "../pages/language-popover/language-popover.model-interface";
import { LoginPageInterface } from "../pages/login/login-interface";
import { GlobalDepartmentConfigDataobject } from "./dataobjects/global-department-config.dataobject";
import { GlobalLanguageConfigDataobject } from "./dataobjects/global-language-config.dataobject";
import { HomePageDepartmentDataobject } from "./dataobjects/homepage.department.dataobject";
import { UserDepartmentFilterConfigDataobject } from "./dataobjects/user-department-filter-config.dataobject";
import { UserLanguageFilterConfigDataObject } from "./dataobjects/user-language-filter-config.dataobject";
import { SuperLoginClient } from "./super_login_client/super_login_client";
import { SuperloginHttpRequester } from "./super_login_client/superlogin_http_requester";
import { EntryListPageModelInterface } from "../pages/entry-list/entry-list.model-interface";
import { EntryListPageEntryDataObject } from "./dataobjects/entrylistpage.entry.dataobject";
import { SingleEntryPageModelInterface } from "../pages/single-entry/single-entry.model-interface";
import { EntryDataObject } from "./dataobjects/entry.dataobject";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface, LanguagePopoverPageModelInterface, EntryListPageModelInterface, SingleEntryPageModelInterface {
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
            relatedDepartments: {
              $in: [departmentId]
            }
          }, fields: ["_id"]
        });

        // add result to the list of departments
        selectedHomePageDepartmentDataObjects.push(HomePageDepartmentDataobject.init(result.docs.length, GlobalDepartmentConfigDataobject.getDepartmentById(this.globalDepartmentConfig, departmentId)));

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
      let regexp = new RegExp("^" + searchString ? searchString : "", 'i');
      selector.name = { $regex: regexp };

      // if departmentId is defined search only for entries that are relevant for the specific department
      if (departmentId) {
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

  public async getEntryDataobject(_id: string, languageId: number): Promise<EntryDataObject> {
    let entryDataObject: EntryDataObject = {
      _id: "6766f814e6011eae9ef28f8c5c00013b",
      name: "P-Freigabe",
      description: "Die P-Freigabe (Produktionsfreigabe) wird benutzt als verbindliche Freigabe zum Anfragen, Beauftragen und Erstellen von Serienprodukti- onsmitteln. Die Freigabe des Konstruktionsstandes erfolgt immer bau- teilspezifisch. Es wird hierbei nicht zwischen einer Freigabe zur Anfrage und Beauftragung und einer weiteren Freigabe zur Erstellung (sog. 'Fräsfreigabe') unterschieden. Zeitlich/inhaltlich ist diese Freigabe im Normalfall im Anschluss an eine erfolgreiche C-Muster-Rafferprobung mit genügend Erfahrung aus der Dauerlauf-/Zuverlässigkeitserprobung positioniert.",
      contact: "Max Mustermann",
      email: "max.mustermann@lehre.dhbw-stuttgart.de",
      relatedDepartments: [
        0,
        1,
        2,
        3,
        5
      ],
      attachments: [
        {
          name: "Test Image",
          url: "https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg"
        },
        {
          name: "DHBW Broschüre",
          url: "http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"
        }
      ],
      departmentSpecifics: [
        {
          departmentId: 1,
          description: "Problematisch an der P-Freigabe ist, dass sie von der Entwicklung einen verbindlichen Zeichnungsstand erfordert, der im Nachhinein nur noch sehr eingeschränkt geändert werden kann.",
          contact: "Max Mustermann",
          email: "max.mustermann@dhbw-stuttgart.de"
        },
        {
          departmentId: 2,
          description: "Für uns ist es wichtig, dass die P-Freigabe möglichst früh im Produktentstehungsprozess von der Entwicklung gegeben wird. Dies ermöglicht uns eine frühzeitige Beschaffung von Maschinen, sodass wir termingerecht mit der Produktion starten können.",
          contact: "Max Mustermann",
          email: "max.mustermann@dhbw-stuttgart.de"
        },
        {
          departmentId: 3,
          description: "Eine möglichst frühzeitige P-Freigabe hilft uns im Einkauf, um rechtzeitig Maschinen zu guten Preisen beschaffen zu können.",
          contact: "Max Mustermann",
          email: "max.mustermann@dhbw-stuttgart.de"
        },
        {
          departmentId: 5,
          description: "Die P-Freigabe ist von uns von keiner besonderen Relevanz.",
          contact: "Max Mustermann",
          email: "max.mustermann@dhbw-stuttgart.de"
        }
      ]
    };
    return entryDataObject;
  };

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): GlobalLanguageConfigDataobject {
    return this.globalLanguageConfig;
  }

  public setSelectedLanguage(userLanguageSetting: UserLanguageFilterConfigDataObject): Promise<UserLanguageFilterConfigDataObject> {
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
      this.globalDepartmentConfig = <GlobalDepartmentConfigDataobject>await this.getDocumentAsJSON(globalAppSettingsDb, AppConfig.GLOBAL_APP_SETTINGS_DEPARTMENTS);

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
