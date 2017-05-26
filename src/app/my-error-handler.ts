import {Injectable, ErrorHandler} from "@angular/core";
import {IonicErrorHandler} from "ionic-angular";
import {Logger} from "./logger";

/**
 * This class handles all the exceptions/errors which get thrown and not caught by the application.
 */
@Injectable()
export class MyErrorHandler extends IonicErrorHandler implements ErrorHandler {

////////////////////////////////////////////Properties////////////////////////////////////////////


////////////////////////////////////////////Constructor////////////////////////////////////////////

    constructor() {
        super();
    }

////////////////////////////////////////Inherited Methods//////////////////////////////////////////

    handleError(exception:any, stackTrace?:any, reason?:string):void {

      // print out the error message
      Logger.error("Exception: " + exception + "\n\nReason: " + reason + "\n\nStackTrace: " + stackTrace);
    }

/////////////////////////////////////////////Methods///////////////////////////////////////////////


}
