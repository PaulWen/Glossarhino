import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import "rxjs/add/operator/map";
import { Logger } from "../app/logger";
import { EditModalInterface } from "../pages/edit-modal/edit-modal-interface";
import { EntryListInterface } from "../pages/entry-list/entry-list-interface";
import { FilterModalInterface } from "../pages/filter-modal/filter-modal-interface";
import { LanguagePopoverPageInterface } from "../pages/language-popover/language-popover-interface";
import { LoginPageInterface } from "../pages/login/login-interface";
import { SingleEntryInterface } from "../pages/single-entry/single-entry-interface";
import { SuperLoginClient } from "./super_login_client/super_login_client";
import { SuperloginHttpRequester } from "./super_login_client/superlogin_http_requester";
import { EntryDataobject } from "./dataobjects/entry.dataobject";
import { DepartmentFilterDataobject } from "./dataobjects/department-filter.dataobject";
import { DepartmentDataobject } from "./dataobjects/department.dataobject";
import { LanguageDataobject } from "./dataobjects/language.dataobject";
import { HomePageModelInterface } from "../pages/home/home.model-interface";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageModelInterface, EntryListInterface, SingleEntryInterface, LanguagePopoverPageInterface, FilterModalInterface, EditModalInterface {
  ////////////////////////////////////////////Properties////////////////////////////////////////////

  //////////////Databases////////////
  /** all the databases for the different languages <Key: Language, Value: PouchDB database object>  */
  private entryDatabases: Map<number, any>;

  /** database that stores all the global app settings */
  private appSettingsDatabase: any;

  /** database that stores all the settings of the currently logged-in user*/
  private userSettingsDatabase: any;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequester: SuperloginHttpRequester) {
    super(httpRequester);

    this.entryDatabases = new Map<number, any>();
    this.appSettingsDatabase = null;
    this.userSettingsDatabase = null;
  }

  ////////////////////////////////////////Inherited Methods//////////////////////////////////////////

  //////////////////////////////////////////
  //            Shared Methods            //
  //////////////////////////////////////////

  public getDepartmentFilter(): Array<DepartmentFilterDataobject> {
    let filter: Array<DepartmentFilterDataobject> = [
      { departmentId: 1, filtered: true },
      { departmentId: 2, filtered: true },
      { departmentId: 3, filtered: true }
    ];
    return filter;
  };

  public getAllDepartments(): Array<DepartmentDataobject> {
    let departments: Array<DepartmentDataobject> = [
      { departmentId: 1, departmentName: "Management" }, { departmentId: 2, departmentName: "Marketing" }, { departmentId: 3, departmentName: "Production" }
    ];
    return departments;
  };

  public getCurrentLanguage(): LanguageDataobject {
    let currentLanguage: LanguageDataobject = { languageId: 0, languageName: "English" }
    return;
  };

  //////////////////////////////////////////
  //            SuperLoginClient Methods            //
  //////////////////////////////////////////

  public initializeDatabases(user_databases: any): void {
    Logger.log(user_databases);

    // initilize settings databases
    this.appSettingsDatabase = this.initializeDatabase("application_settings", user_databases.application_settings);
    this.userSettingsDatabase = this.initializeDatabase("settings", user_databases.settings);


    // initilize entry databases
    for (let languageId of this.getAllLanguagIds()) {
      this.entryDatabases.set(languageId, this.initializeDatabase("application_settings", user_databases["language_" + languageId]));
    }
  }


  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public getListings(currentLanguage: LanguageDataobject, departmentId?: number): number {
    return departmentId ? departmentId * 10 + 13 : 42;
  };

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  public getEntry(name: string): EntryDataobject {

    return null;
    // return new EntryDataobject("Lorem Ipsum EntryDataobject", 0, [
    //   new DepartmentEntryDescriptionDataobject(0, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
    //   new DepartmentEntryDescriptionDataobject(1, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
    //   new DepartmentEntryDescriptionDataobject(2, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
    //   new DepartmentEntryDescriptionDataobject(3, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de")])
  }

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): Array<string> {
    return ["English", "German"];
  };

  private getAllLanguagIds(): Array<number> {
    return [1, 2];
  };

  public getLanguage(): string {
    return "English";
  }

  public setLanguage(language: string) {
    Logger.log("Language successfully changed to: " + language);
  }


  //////////////////////////////////////////
  //      FilterModalInterface Methods    //
  //////////////////////////////////////////

  public setFilter(filterSettings: Array<boolean>) {

  }


  //////////////////////////////////////////
  //       EditModalInterface Methods     //
  //////////////////////////////////////////

  public setEntry(entry: EntryDataobject) {
  };

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


  // /**
  //  * This method returns an document with a specific id.
  //  *
  //  * @param id the id of the wanted document
  //  *
  //  * @return the wanted document or null if the documented got already deleted or an error occurred
  //  */
  // public async getDocumentAsJSON(id: string): Promise<DocumentType> {
  //   try {
  //     // load the wanted document from the database and save it in the right DocumentType
  //     return new this.documentCreator(await this.database.get(id), this);
  //   } catch (error) {
  //     Logger.error(error);
  //     return null;
  //   }
  // }


  // /**
  //  * This function creates an new document from the type <DocumentType> in the database.
  //  *
  //  * @return the new created document or null if an error occurred
  //  */
  // public async newDocument(): Promise<DocumentType> {
  //   try {
  //     // upload the updated user data
  //     let newDocument = await this.database.post({});
  //
  //     // convert the new created document to the right object type
  //     return new this.documentCreator({
  //       _id: newDocument.id,
  //       _rev: newDocument.rev
  //     }, this);
  //   } catch (error) {
  //     Logger.error(error);
  //     return null;
  //   }
  // }
  //
  //
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
  //
  // /**
  //  * This method loads a document in the database.
  //  *
  //  * @param json the document, which should get loaded in the database,  as an json object
  //  *
  //  * @return true if the operation was successfully or false in the case of an error
  //  */
  // public async putDocument(json: any): Promise<boolean> {
  //   try {
  //     // upload the document
  //     await this.database.put(json);
  //     return true;
  //   } catch (error) {
  //     Logger.error(error);
  //     return false;
  //   }
  // }


}
