import {SuperLoginClientError} from "./super_login_client_error";

/**
 * This interface describes a error callback function that gets
 * used to passe a error handler to Superogin requests. As a parameter the function
 * passes on object of "SuperLoginClientErrorResponse" which describes the error(s).
 */
export interface SuperLoginClientErrorResponse {

/////////////////////////////////////////////Methods///////////////////////////////////////////////

    (error: SuperLoginClientError): void;
}