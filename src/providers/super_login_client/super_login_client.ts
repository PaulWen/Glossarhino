import {Injectable} from "@angular/core";
import {LoadingController, Platform} from "ionic-angular";
import PouchDB from "pouchdb";
import {Observable} from "rxjs/Rx";
import {AppConfig} from "../../app/app-config";
import {Logger} from "../../app/logger";
import {UserDataObject} from "../dataobjects/user.dataobject";
import {SuperLoginClientDoneResponse} from "./super_login_client_done_reponse";
import {SuperLoginClientError} from "./super_login_client_error";
import {SuperLoginClientErrorResponse} from "./super_login_client_error_reponse";
import {SuperloginHttpRequester} from "./superlogin_http_requester";

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
export abstract class SuperLoginClient {

  ////////////////////////////////////////////Constants/////////////////////////////////////////////

  private static get SESSION_TOKEN_STORAGE_ID(): string {
    return "session_token";
  };

  ////////////////////////////////////////////Properties////////////////////////////////////////////

  protected platform: Platform;

  /** provides functions to easily perform http requests */
  private httpRequestor: SuperloginHttpRequester;

  /** indicates if the user is currently authenticated */
  private authenticated: boolean;

  /** indicates if the user works currently with offline data */
  private offlineMode: boolean;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  /**
   * Constructor of the class SuperLoginClient.
   *
   * @param httpRequestor
   */
  constructor(httpRequestor: SuperloginHttpRequester, platform: Platform) {
    this.httpRequestor = httpRequestor;
    this.platform = platform;
    this.authenticated = false;
    this.offlineMode = false;

    // if the application is not in production use than make the PouchDB object available
    // in order to be able to use the Chrome PouchDB plugin to inspect the local data
    if (AppConfig.DEVELOPMENT) {
      (<any>window
      ).PouchDB = PouchDB;
      //      PouchDB.debug.enable("*");
      PouchDB.debug.disable();
    } else {
      PouchDB.debug.disable();
    }
  }

  ////////////////////////////////////////Getter and Setter//////////////////////////////////////////


  ////////////////////////////////////////Inherited Methods//////////////////////////////////////////


  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  /**
   * This method checks if the user is currently online or offline.
   *
   * @return {boolean}
   */
  public isOnline(): boolean {
    if (this.platform.is("cordova")) {
      return (<any>navigator
             ).connection.type != "none";
    } else {
      return true;
    }
  }

  /**
   * This function gets called by the SuperLoginClient when ever the user logs in successfully.
   * (The user has to be online!)
   *
   * @param user_databases array of all user databases and the URL's to those
   */
  abstract async initializeDatabasesOnline(user_databases: any, loadingCtrl: LoadingController): Promise<boolean>;

  /**
   * This function gets called by the SuperLoginClient when the user is currently offline but he might have already loaded
   * the needed data to the local storage because of an earlier login. This function tries to find the needed data
   * in the local storage.
   * (The user is offline!)
   *
   * @return true if the needed data could be loaded - false if the needed data could not be loaded
   */
  abstract async initializeDatabasesOffline(loadingCtrl: LoadingController): Promise<boolean>;

  /**
   * This function gets called as soon as the users gets logged out in order to remove all the data
   * from the local client.
   */
  abstract destroyDatabases(): void;

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  public isAuthenticated(loadingCtrl: LoadingController): Promise<boolean> {

    // check if the user is already authenticated
    if (this.authenticated) {
      return new Promise((resolve, reject) => {
        resolve(true);
        return;
      });

      // if the user is not yet authenticated...
    } else {
      // ... check if the user is currently online
      if (this.isOnline()) {
        // try to authenticate him by using the session/local storage data
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
              , loadingCtrl
            );
          }).toPromise();
        } else {
          return new Promise((resolve, reject) => {

            resolve(false);
            return;
          });
        }

        // if the user is offline try to load data from the local storage
      } else {
        // if the user already works with the offline data the data has not to be loaded again
        if (this.offlineMode) {
          return new Promise((resolve, reject) => {
            resolve(true);
            return;
          });

          // if the user does not yet work with the offline data it should be tried to load offline data
        } else {
          return new Promise((resolve, reject) => {
            this.initializeDatabasesOffline(loadingCtrl).then((data) => {
              if (data) {
                this.offlineMode = true;
                resolve(true);
                return;
              } else {
                reject("No local data and no internet connection!");
                return;
              }
            });
          });
        }
      }
    }
  }


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
  public loginWithCredentials(email: string, password: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse, loadingCtrl: LoadingController) {
    // log the user in
    this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/login", null, {
      // since the username is not allowed to include Capital letters we have to make sure that it does not
      username: email.toLocaleLowerCase(),
      password: password
    }).subscribe(
      (data: any) => {
        // finish the authentication
        this.finishAuthentication(data.token + ":" + data.password, stayAuthenticated, done, error, loadingCtrl);
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
  private loginWithSessionToken(sessionToken: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse, loadingCtrl: LoadingController) {
    // check if the given session token is valid
    this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/session", sessionToken).subscribe(
      // if session token is still valid
      (data: any) => {
        // finish the authentication
        this.finishAuthentication(sessionToken, stayAuthenticated, done, error, loadingCtrl);
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
  private finishAuthentication(sessionToken: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse, loadingCtrl: LoadingController) {
    // set authenticated to true
    this.authenticated = true;
    this.offlineMode = false;

    // store the current session token
    this.saveSessionToken(stayAuthenticated, sessionToken);

    // extend the session token
    this.extendSessionToken();

    // providing the app with the URLs to the user databases
    this.initializeUserDatabases(done, error, loadingCtrl);
  }

  /**
   * This method loads all the database names of the users databases and passes those to the DatabaseInitializer.
   *
   * @param done callback function once the request was successful
   * @param error callback function in case an error occurred
   */
  private initializeUserDatabases(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse, loadingCtrl: LoadingController): void {
    // load the database names
    this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/user-db/", this.getSessionToken()).subscribe(
      // if the database names got loaded successfully
      (data: any) => {
        // give the database names to the database initializer
        this.initializeDatabasesOnline(data, loadingCtrl).then((data) => {
          done();
        }, (errorObject) => {
          error(errorObject);
        });
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
  public logout(done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse) {
    // destroy all databases
    this.destroyDatabases();

    // logout the user
    this.httpRequestor.postJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/logout", this.getSessionToken(), {}).subscribe(
      (data: any) => {
        done();
        this.authenticated = false;
        this.offlineMode = false;
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

  /**
   * This method loads the user data of the currently authenticated user from the database and returns it.
   *
   * @return {@link UserDataObject}
   */
  public async getUserData(): Promise<UserDataObject> {
    // load the database names
    return this.httpRequestor.getJsonData(AppConfig.WEB_SERVER_DOMAIN + "/auth/user-data/", this.getSessionToken()).toPromise();
  }

}
