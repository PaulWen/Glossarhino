import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppModelService} from "../../providers/app-model-service";
import {SuperLoginClientError} from "../../providers/super_login_client/super_login_client_error";
import {LoginPageInterface} from "./login-interface";

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
  private loginOpened: boolean;


  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, loadingCtrl: LoadingController, appModelService: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.loadingCtrl = loadingCtrl;

    // instantiate model service object
    this.appModelService = appModelService;

    // instantiate other
    this.loginOpened = true;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return true;
  }

  private async ionViewWillEnter() {
    console.log("LoginPage check if logged in");
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
    // test if user is online
    if (this.appModelService.isOnline()) {
      this.appModelService.register(name, email, password, confirmPassword, () => {
        // successfully registred
        this.navCtrl.setRoot("HomePage").then((canEnterView) => {
          if (!canEnterView) {
            // in the case that the view can not be entered redirect the user to the login page
            this.navCtrl.setRoot("LoginPage");
          }
        });

        // log user in
        this.login(email, password, rememberLogin);
      }, (error: SuperLoginClientError) => {
        if (error.checkForError != undefined) {
          // error
          if ((<any>error.getErrorMessage()).loaded != undefined && (<any>error.getErrorMessage()).loaded == 0) {
            // the above query test for a "ProgressEvent" object which appears if there is no internet connection
            alert("No internet connection!");
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_1)) {
            alert(SuperLoginClientError.AUTH_ERR_1);
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_2)) {
            alert(SuperLoginClientError.AUTH_ERR_2);
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_3)) {
            alert(SuperLoginClientError.AUTH_ERR_3);
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_4)) {
            alert(SuperLoginClientError.AUTH_ERR_4);
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_5)) {
            alert(SuperLoginClientError.AUTH_ERR_5);
          }
          if (error.checkForError(SuperLoginClientError.AUTH_ERR_6)) {
            alert(SuperLoginClientError.AUTH_ERR_6);
          }
        } else {
          throw error;
        }
      });
    } else {
      alert("No internet connection!");
    }
  }

  private login(email: string, password: string, rememberLogin: boolean) {
    // test if user is online
    if (this.appModelService.isOnline()) {
      try {
        this.appModelService.loginWithCredentials(email, password, rememberLogin, () => {
          // successfully loged-in
          this.navCtrl.setRoot("HomePage").then((canEnterView) => {
            if (!canEnterView) {
              // in the case that the view can not be entered redirect the user to the login page
              this.navCtrl.setRoot("LoginPage");
            }
          });

        }, (error: SuperLoginClientError) => {
          if (error.checkForError != undefined) {
            // error
            if ((<any>error.getErrorMessage()).loaded != undefined && (<any>error.getErrorMessage()).loaded == 0) {
              // the above query test for a "ProgressEvent" object which appears if there is no internet connection
              alert("No internet connection!");
            }
            if (error.checkForError(SuperLoginClientError.LOGIN_ERR_1)) {
              alert(SuperLoginClientError.LOGIN_ERR_1);
            }
            if (error.checkForError(SuperLoginClientError.LOGIN_ERR_2)) {
              alert(SuperLoginClientError.LOGIN_ERR_2);
            }
          } else {
            throw error;
          }

        }, this.loadingCtrl);
      } catch (error) {
        Logger.debug(error);
      }
    } else {
      alert("No internet connection!");
    }
  }

}
