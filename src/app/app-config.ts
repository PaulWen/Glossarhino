/**
 * This class defines constants which can be used to configure the application.
 */
export class AppConfig {

////////////////////////////////////////////Properties////////////////////////////////////////////

  public static get DEVELOPMENT(): boolean {
    return true;
  };

  public static get WEB_SERVER_DOMAIN(): string {
//    return "http://localhost:3000";
    return "http://wwiappdev1.dhbw-stuttgart.de:3000";
  };

  public static get LOREM_IPSUM(): string {
    return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
  };


  //////////////////////////IDs of Special Doc in the Databases////////////////////////
  public static get GLOBAL_APP_SETTINGS_DEPARTMENTS(): string {
    return "departments";
  };

  public static get GLOBAL_APP_SETTINGS_LANGUAGES(): string {
    return "languages";
  };


  public static get USER_APP_SETTINGS_DEPARTMENT_FILTERS(): string {
    return "department-filters";
  };

  public static get USER_APP_SETTINGS_LANGUAGE_FILTERS(): string {
    return "language-filters";
  };


  public static get NAME_LIST_INDEX_PREFIX(): string {
    return "name_list_index_";
  };
}
