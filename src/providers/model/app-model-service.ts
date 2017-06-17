import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SuperLoginClient} from "../super_login_client/super_login_client";
import {Logger} from "../../app/logger";
import {SuperloginHttpRequestor} from "../super_login_client/superlogin_http_requestor";
import {LoginPageInterface} from "../../pages/login/login-interface";
import {HomePageInterface} from "../../pages/home/home-interface";
import {EntryListInterface} from "../../pages/entry-list/entry-list-interface";
import {SingleEntryInterface} from "../../pages/single-entry/single-entry-interface";
import {AppConfig} from "../../app/app-config";
import {Entry} from "./entry-model";
import {Attachment} from "./attachment-model";
import {Department} from "./department-model";
import {LanguagePopoverPageInterface} from "../../pages/language-popover/language-popover-interface";
import {FilterModalInterface} from "../../pages/filter-modal/filter-modal-interface";
import {EditModalInterface} from "../../pages/edit-modal/edit-modal-interface";

@Injectable()
export class AppModelService extends SuperLoginClient implements LoginPageInterface, HomePageInterface, EntryListInterface, SingleEntryInterface, LanguagePopoverPageInterface, FilterModalInterface, EditModalInterface {
////////////////////////////////////////////Properties////////////////////////////////////////////


////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(httpRequestor: SuperloginHttpRequestor) {
    super(httpRequestor);
  }

////////////////////////////////////////Inherited Methods//////////////////////////////////////////

  //////////////////////////////////////////
  //            Shared Methods            //
  //////////////////////////////////////////

  public getFilter(): Array<boolean> {
    let filter: Array<boolean> = [];
    filter[1] = true;
    filter[2] = false;
    filter[3] = true;

    return filter;
  };

  public getAllDepartments(): Array<number> {
    return [1, 2, 3];
  }

  //////////////////////////////////////////
  //            SuperLoginClient Methods            //
  //////////////////////////////////////////

  public initializeDatabases(user_databases: any): void {
    //TODO: lade alle Datenbanken
    Logger.debug("Datenbanken:");
    Logger.log(user_databases);
  }



  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////

  public getListings(departmentId?: number): number {
    return 42;
  };




  //////////////////////////////////////////
  //       HomePageInterface Methods      //
  //////////////////////////////////////////
  public getEntryList(searchString: String, language: String, departmentId?: number): Array<String> {
    if (searchString == "") {
      return ["Entry 1", "Entry 2", "Entry 3"];
    } else {
      return ["Entry 1", "Entry 2"];
    }
  }

  //////////////////////////////////////////
  //     SingleEntryInterface Methods     //
  //////////////////////////////////////////

  public getEntry(name: String): Entry {
    return new Entry("Lorem Ipsum Entry", 0, [
      new Department(0, AppConfig.LOREM_IPSUM, [new Attachment("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new Department(1, AppConfig.LOREM_IPSUM, [new Attachment("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new Department(2, AppConfig.LOREM_IPSUM, [new Attachment("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new Department(3, AppConfig.LOREM_IPSUM, [new Attachment("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de")])
  }

  //////////////////////////////////////////
  // LanguagePopoverPageInterface Methods //
  //////////////////////////////////////////

  public getAllLanguages(): Array<String> {
    return ["English", "German"];
  };

  public getLanguage(): String {
    return "English";
  }

  public setLanguage(language: String) {
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

  public setEntry(entry: Entry) {};

/////////////////////////////////////////////Methods///////////////////////////////////////////////

}