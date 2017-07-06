import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppModelService} from "../../providers/app-model-service";
import {SuperLoginClientError} from "../../providers/super_login_client/super_login_client_error";
import {LoginPageInterface} from "./login-interface";
import {TranslateService} from "@ngx-translate/core";
import {Alerts} from "../../app/alerts";

/**
 * LoginPage where the user authenticates itself and is also able to create a new account.
 */
@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  ////////////////////////////////////////////Properties/////////////////////////////////////////////

  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private loadingCtrl: LoadingController;

  // model service object
  private appModelService: LoginPageInterface;

  //other
  private translateService: TranslateService;
  private loginOpened: boolean;


  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, loadingCtrl: LoadingController, appModelService: AppModelService, translateService: TranslateService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.loadingCtrl = loadingCtrl;

    // instantiate model service object
    this.appModelService = appModelService;

    // instantiate other
    this.translateService = translateService;
    this.loginOpened = true;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return true;
  }

  private async ionViewWillEnter() {
    Logger.log("LoginPage check if logged in");
    if (await this.appModelService.isAuthenticated(this.loadingCtrl)) {
      // redirect to home page
      this.navCtrl.setRoot("HomePage").then((canEnterView) => {
        if (!canEnterView) {
          // in the case that the view can not be entered redirect the user to the login page
          this.navCtrl.setRoot("LoginPage");
        }
      });
    }
  }


  private register(name: string, email: string, password: string, confirmPassword: string, rememberLogin: boolean) {
    // open loading dialog since this may take a while
    let loadingAlert = Alerts.presentLoadingDefault(this.loadingCtrl, this.translateService);

    // test if user is online
    if (this.appModelService.isOnline()) {
      this.appModelService.register(name, email, password, confirmPassword, () => {
        // close loading dialog
        loadingAlert.dismiss();

        // log user in
        this.login(email, password, rememberLogin);
      }, (error: SuperLoginClientError) => {
        // close loading dialog
        loadingAlert.dismiss();

        if (error.checkForError != undefined) {
          // error
          if ((<any>error.getErrorMessage()).loaded != undefined && (<any>error.getErrorMessage()).loaded == 0) {
            // the above query test for a "ProgressEvent" object which appears if there is no internet connection
            this.translateService.get('NO_CONNECTION_ALERT').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_1)) {
            this.translateService.get('AUTH_ERR_1').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_2)) {
            this.translateService.get('AUTH_ERR_2').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_3)) {
            this.translateService.get('AUTH_ERR_3').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_4)) {
            this.translateService.get('AUTH_ERR_4').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_5)) {
            this.translateService.get('AUTH_ERR_5').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_6)) {
            this.translateService.get('AUTH_ERR_6').subscribe(
              (data) => {
                alert(data);
              }
            );
          }
        } else {
          throw error;
        }
      });
    } else {
      this.translateService.get('NO_CONNECTION_ALERT').subscribe(
        (data) => {
          alert(data);
        }
      );
    }
  }

  private login(email: string, password: string, rememberLogin: boolean) {
    // open loading dialog since this may take a while
    let loadingAlert = Alerts.presentLoadingDefault(this.loadingCtrl, this.translateService);

    // test if user is online
    if (this.appModelService.isOnline()) {
      try {
        this.appModelService.loginWithCredentials(email, password, rememberLogin, () => {
          // successfully logged-in
          this.navCtrl.setRoot("HomePage").then((canEnterView) => {
            if (!canEnterView) {
              // in the case that the view can not be entered redirect the user to the login page
              this.navCtrl.setRoot("LoginPage");
            }
          });

          // close loading dialog
          loadingAlert.dismiss();

        }, (error: SuperLoginClientError) => {
          // close loading dialog
          loadingAlert.dismiss();

          if (error.checkForError != undefined) {
            // error
            if ((<any>error.getErrorMessage()).loaded != undefined && (<any>error.getErrorMessage()).loaded == 0) {
              // the above query test for a "ProgressEvent" object which appears if there is no internet connection
              this.translateService.get('NO_CONNECTION_ALERT').subscribe(
                (data) => {
                  alert(data);
                }
              );
            }
            if (error.checkForError(SuperLoginClientError.LOGIN_ERR_1)) {
              this.translateService.get('LOGIN_ERR_1').subscribe(
                (data) => {
                  alert(data);
                }
              );
            }
            if (error.checkForError(SuperLoginClientError.LOGIN_ERR_2)) {
              this.translateService.get('LOGIN_ERR_2').subscribe(
                (data) => {
                  alert(data);
                }
              );
            }
          } else {
            throw error;
          }

        }, this.loadingCtrl);
      } catch (error) {
        Logger.debug(error);
      }
    } else {
      this.translateService.get('NO_CONNECTION_ALERT').subscribe(
        (data) => {
          alert(data);
        }
      );
    }
  }
}
