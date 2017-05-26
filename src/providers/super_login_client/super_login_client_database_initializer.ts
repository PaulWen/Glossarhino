/**
 * This abstract class defines a method which will be called by "SuperLoginClient"
 * as soon as the user logs in. It is used in order to provide the app with
 * information about the user like the URLs to the databases of the user.
 */
export abstract class SuperLoginClientDatabaseInitializer {

/////////////////////////////////////////////Methods///////////////////////////////////////////////

    /**
     * This function gets called by the SuperLoginClient when ever the user logs in successfully.
     *
     * @param user_databases array of all user databases and the URL's to those
     */
    abstract initializeDatabases(user_databases: any): void

}