import {Injectable} from "@angular/core";
import {SuperloginHttpRequestor} from "./superlogin_http_requestor";
import {SuperLoginClientError} from "./super_login_client_error";
import {SuperLoginClientDoneResponse} from "./super_login_client_done_reponse";
import {SuperLoginClientErrorResponse} from "./super_login_client_error_reponse";
import {Logger} from "../../app/logger";
import {SuperLoginClientDatabaseInitializer} from "./super_login_client_database_initializer";
import {Observable} from "rxjs/Rx";
import {AppConfig} from "../../app/app-config";

/**
 * This class is a service which implements TypeScript methods to communicate
 * with the ServerLogin API running on the server.
 *
 * The purposes of the class are:
 *  1) register users
 *  2) login users --> initializes the all databases used by the app by calling a initialize function
 *  3) logout users
 *  4) check if user is logged in
 *  5) renew connection that that session does not end before user is done
 *  6) change password or email
 *
 *
 *  How the class handles authentication:
 *      1) user logs in with his credentials which this class sends to the server to verify the credentials
 *      2) server returns a session token which can be used from now on the authenticate the user
 *      3) the session token gets stored in...
 *          a) the session storage in case the user does not want the app to remember the login
 *          b) the local storage in case the user wants the app to remember the login
 *      4) user leaves the page/app
 *          a) the user will be logged out (session token becomes invalid)
 *          b) if the user wants the app to remember the login, the user does not get logged out
 *
 * The Service can only handle one login at a time!
 */
@Injectable()
export class SuperLoginClient {

////////////////////////////////////////////Constants/////////////////////////////////////////////

    private static get SESSION_TOKEN_STORAGE_ID(): string {return 'session_token';};

////////////////////////////////////////////Properties////////////////////////////////////////////

    /** provides functions to easily perform http requests */
    private httpRequestor: SuperloginHttpRequestor;

    /** a {@link SuperLoginClientDatabaseInitializer} that defines a function which gets called to configure the correct database URLs of CouchDB */
    private _databaseInitializer: SuperLoginClientDatabaseInitializer;

    /** indicates if the user is currently authenticated */
    private authenticated: boolean;

////////////////////////////////////////////Constructor////////////////////////////////////////////

    /**
     * Constructor of the class SuperLoginClient.
     *
     * @param httpRequestor
     */
    constructor(httpRequestor: SuperloginHttpRequestor) {
        this.httpRequestor = httpRequestor;
        this._databaseInitializer = null;
        this.authenticated = false;
    }

////////////////////////////////////////Getter and Setter//////////////////////////////////////////

  /**
   * Sets the {@link SuperLoginClientDatabaseInitializer} that should receive the database URLs whenever the user
   * authenticates himself.
   *
   * @param databaseInitializer
   */
  set databaseInitializer(databaseInitializer: SuperLoginClientDatabaseInitializer) {
    this._databaseInitializer = databaseInitializer;
  }

////////////////////////////////////////Inherited Methods//////////////////////////////////////////

    /**
     *  This method checks if the user is already authenticated.
     *
     * @returns true or false depending on if the user is already authenticated
     */
    public isAuthenticated(): Observable<boolean> | boolean {
        // check if the user is already authenticated
        if (this.authenticated) {
            return true;

        // if the user is not yet authenticated try to authenticate him by using the session/local storage data
        } else {
           if (this.isSessionTokenStoredPersistent() != null) {
               return Observable.create((observer) => {
                   this.loginWithSessionToken(this.getSessionToken(), this.isSessionTokenStoredPersistent(),
                       () => {
                           // end the observable and return the result
                           observer.next(true);
                           observer.complete();
                       },
                       (error: SuperLoginClientError) => {
                           // remove the invalid session token stored in the session/local storage
                           this.deleteSessionToken();

                           // end the observable and return the result
                           observer.next(false);
                           observer.complete();
                       }
                   );
               });
           } else {
               return false;
           }
        }
    }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // METHODS TO STORE SESSION TOKEN IN THE LOCAL OR SESSION STORAGE
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * The method saves a session token in either the local or session storage.
     *
     * @param persistent indicated if the data should be stored so that it also exists after the browser session (after an browser restart)
     * @param sessionToken the token that should get stored
     */
    private saveSessionToken(persistent: boolean, sessionToken: string) {
        // remove all current savings
        this.deleteSessionToken();

        // save the session token
        if (persistent) {
            window.localStorage.setItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID, sessionToken);
        } else {
            window.sessionStorage.setItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID, sessionToken);
        }
    }

    /**
     * This method removes all session token data out of the session and local storage.
     */
    private deleteSessionToken() {
        // delete session token from the session storage
        window.sessionStorage.removeItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID);

        // delete session token from the local storage
        window.localStorage.removeItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID);
    }

    /**
     * This method checks if the session token gets stored persistent in the local storage.
     *
     * @returns true = local storage, false = session storage, null = no session token gets stored at all
     */
    private isSessionTokenStoredPersistent(): boolean {
        if (window.localStorage.getItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID)) {
            return true;
        } else if (window.sessionStorage.getItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID)) {
            return false;
        } else {
            return null;
        }
    }
    /**
     * This method returns the session token out of the session or local storage.
     *
     * @returns a string representing the current session token or null in case no session token is stored in the storage
     */
    private getSessionToken(): string {
        let isSessionTokenStoredPersistent = this.isSessionTokenStoredPersistent();

        // check if a session token got stored anywhere
        if (isSessionTokenStoredPersistent != null) {
            // if the session token gets stored persistent return the value of the local storage
            if (isSessionTokenStoredPersistent) {
                return window.localStorage.getItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID);

            // if the session token gets not stored persistent return the value of the session storage
            } else {
                return window.sessionStorage.getItem(SuperLoginClient.SESSION_TOKEN_STORAGE_ID);
            }

        // if no session token got stored at all
        } else {
            return null;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // METHODS TO LOGIN THE USER
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * The function uses superlogin-client to login the user withe the given credentials.
     *
     * @param email of the user
     * @param password of the user
     * @param stayAuthenticated set true, if the session token should get stored in a cookie, so that the session token can be reused for the next login
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     */
    public loginWithCredentials(email: string, password: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse)  {
        // log the user in
        this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/login", null, {
            // since the username is not allowed to include Capital letters we have to make sure that it does not
            username: email.toLocaleLowerCase(),
            password: password
        }).subscribe(
            (data: any) => {
                // finish the authentication
                this.finishAuthentication(data.token + ":" + data.password, stayAuthenticated, done, error);
                Logger.log("Authenticated.");
            },
            (errorObject) => {
                // create error object to evaluate the error
                let superLoginClientError: SuperLoginClientError = new SuperLoginClientError(errorObject);

                // Log the Error
                Logger.error(superLoginClientError.getErrorMessage());

                // call the error callback function
                error(superLoginClientError);
                Logger.log("Authentication failed.");
            }
        );
    }

    /**
     * This methods tries to authenticate the user with a given session token by checking
     * if the given session token is still valid.
     *
     * @param sessionToken the session token which should be used for authentication
     * @param stayAuthenticated set true, if the session token should get stored in a cookie, so that the session token can be reused for the next login
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     *
     * @returns {Observable<boolean>} returns true or false depending on if a valid session token could be loaded
     */
    private loginWithSessionToken(sessionToken: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse) {
        // check if the given session token is valid
        this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/session", sessionToken).subscribe(
            // if session token is still valid
            (data: any) => {
                // finish the authentication
                this.finishAuthentication(sessionToken, stayAuthenticated, done, error);
                Logger.log("Authenticated.");
            },

            // if session token is not valid anymore
            (errorObject) => {
                // call the error callback function
                error(new SuperLoginClientError(errorObject));
            }
        );
    }


    /**
     * This function should get called once the user got successfully authenticated.
     * The function makes sure that the app gets provided with all the information it needs.
     *
     * @param sessionToken the valid session token for the users current session
     * @param stayAuthenticated set true, if the session token should get stored in a cookie, so that the session token can be reused for the next login
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     */
    private finishAuthentication(sessionToken: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse) {
        // set authenticated to true
        this.authenticated = true;

        // store the current session token
        this.saveSessionToken(stayAuthenticated, sessionToken);

        // extend the session token
        this.extendSessionToken();

        // providing the app with the URLs to the user databases
        this.initializeUserDatabases(done, error);
    }

    /**
     * This method loads all the database names of the users databases and passes those to the DatabaseInitializer.
     *
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     */
    private initializeUserDatabases(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void {
        // load the database names
        this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/user-db/", this.getSessionToken()).subscribe(
            // if the database names got loaded successfully
            (data: any) => {
                // give the database names to the database initializer
                this._databaseInitializer.initializeDatabases(data);
                done();
            },

            // in case of an error
            (errorObject) => {
                // call the error callback function
                error(new SuperLoginClientError(errorObject));
            }
        );
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // OTHER METHODS FOR COMMUNICATING WITH SUPERLOGIN
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * The function uses superlogin-client to register the user with the given information. The user will not
     * be logged in afterwards.
     *
     * @param name of the user
     * @param email of the user
     * @param password of the user
     * @param confirmPassword of the user
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     */
    public register(name: string, email: string, password: string, confirmPassword: string, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse) {
        this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/register", null, {
            // since the username is not allowed to include Capital letters we have to make sure that it does not
            name: name,
            email: email.toLocaleLowerCase(),
            password: password,
            confirmPassword: confirmPassword
        }).subscribe(
            (data: any) => {
                done();
                Logger.log("New account created.");
            },
            (errorObject) => {
                let superLoginClientError: SuperLoginClientError = new SuperLoginClientError(errorObject);

                // Log the Error
                Logger.error(superLoginClientError.getErrorMessage());

                // call the error callback function
                error(superLoginClientError);

                Logger.log("Could not create new account.");
            }
        );
    }

    /**
     * The method logs out the user. The current session token gets invalid.
     *
     * @param done callback function once the request was successful
     * @param error callback function in case an error occurred
     */
    public logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse)  {
        this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/logout", this.getSessionToken(), {}).subscribe(
            (data: any) => {
                done();
                this.authenticated = false;
            },
            (errorObject) => {
                let superLoginClientError: SuperLoginClientError = new SuperLoginClientError(errorObject);

                // Log the Error
                Logger.error(superLoginClientError.getErrorMessage());

                // call the error callback function
                error(superLoginClientError);
            }
        );

    }

    /**
     * This function checks if a email is already in use.
     *
     * @param email
     * @param trueCallback gets called if the email is already in use
     * @param falseCallback gets called if the email is not yet in use
     */
    public isEmailInUse(email: string, trueCallback: SuperLoginClientDoneResponse, falseCallback: SuperLoginClientDoneResponse) {
        this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/validateEmailUsername/" + email, null).subscribe(
            (data: any) => {
                trueCallback();
            },
            (errorObject) => {
                let superLoginClientError: SuperLoginClientError = new SuperLoginClientError(errorObject);

                // Log the Error
                Logger.error(superLoginClientError.getErrorMessage());

                // check if error = email already in use
                if (superLoginClientError.checkForError(SuperLoginClientError.AUTH_ERR_1)) {
                    falseCallback();
                }
            }
       );
    }

    /**
     * This method renews the current session token.
     */
    private extendSessionToken(): void {
        this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/refresh/", this.getSessionToken(), {}).subscribe(
            (data: any) => {
                // all done successfully
                Logger.log("Session successfully extended.");
            },
            (errorObject) => {
                let superLoginClientError: SuperLoginClientError = new SuperLoginClientError(errorObject);

                // Log the Error
                Logger.log("Failed to extend session.");
                Logger.error(superLoginClientError.getErrorMessage());
            }
        );
    }
}
