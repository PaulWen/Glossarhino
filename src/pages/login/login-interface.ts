import {SuperLoginClientErrorResponse} from "../../providers/super_login_client/super_login_client_error_reponse";
import {SuperLoginClientDoneResponse} from "../../providers/super_login_client/super_login_client_done_reponse";
import {Promise} from "es6-promise";
/**
 * Interface to define what the App-Model needs implemented in order to work
 */
export interface LoginPageInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(): Promise<boolean> | boolean;

  /**
   * The function uses superlogin-client to login the user withe the given credentials.
   *
   * @param email of the user
   * @param password of the user
   * @param stayAuthenticated set true, if the session token should get stored in a cookie, so that the session token can be reused for the next login
   * @param done callback function once the request was successful
   * @param error callback function in case an error occurred
   */
  loginWithCredentials(email: string, password: string, stayAuthenticated: boolean, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void;

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
  register(name: string, email: string, password: string, confirmPassword: string, done: SuperLoginClientDoneResponse, error: SuperLoginClientErrorResponse): void;
}
