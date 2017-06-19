import {Component} from "@angular/core";
import {Promise} from "es6-promise";
import {IonicPage, NavController, NavParams} from "ionic-angular";
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

  private model: LoginPageInterface;

  private loginOpened: boolean;

////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(private navCtrl: NavController, private navParams: NavParams, appModelService: AppModelService) {
    this.model = appModelService;
    this.loginOpened = true;
  }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return true;
  }

  private ionViewWillEnter() {
    console.log("LoginPage check if loged in");
    let isAuthenticatedResult: Promise<boolean> | boolean = this.model.isAuthenticated();


    // test if the returned value is a Promise
    if (isAuthenticatedResult instanceof Promise) {

      isAuthenticatedResult.then((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          // redirect to home page
          this.navCtrl.setRoot("HomePage").then((canEnterView) => {
            if (!canEnterView) {
              // in the case that the view can not be entered redirect the user to the login page
              this.navCtrl.setRoot("LoginPage");
            }
          });
        }
      });

      // otherwise it is a boolean
    } else {
      if (isAuthenticatedResult) {
        // redirect to home page
        this.navCtrl.setRoot("HomePage").then((canEnterView) => {
          if (!canEnterView) {
            // in the case that the view can not be entered redirect the user to the login page
            this.navCtrl.setRoot("LoginPage");
          }
        });
      }
    }

  }


  private register(name: string, email: string, password: string, confirmPassword: string, rememberLogin: boolean) {
    Logger.log("Register: " + email + "; " + password + "; " + confirmPassword + "; " + rememberLogin);

    this.model.register(name, email, password, confirmPassword, () => {
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
      // error
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
    });
  }

  private login(email: string, password: string, rememberLogin: boolean) {
    Logger.log("Login: " + email + "; " + password + "; " + rememberLogin);

    this.model.loginWithCredentials(email, password, rememberLogin, () => {
      // successfully loged-in
      this.navCtrl.setRoot("HomePage").then((canEnterView) => {
        if (!canEnterView) {
          // in the case that the view can not be entered redirect the user to the login page
          this.navCtrl.setRoot("LoginPage");
        }
      });

    }, (error: SuperLoginClientError) => {
      // error
      if (error.checkForError(SuperLoginClientError.LOGIN_ERR_1)) {
        alert(SuperLoginClientError.LOGIN_ERR_1);
      }
      if (error.checkForError(SuperLoginClientError.LOGIN_ERR_2)) {
        alert(SuperLoginClientError.LOGIN_ERR_2);
      }
    });
  }
}
