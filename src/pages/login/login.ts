import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController } from "ionic-angular";
import { Logger } from "../../app/logger";
import { AppModelService } from "../../providers/app-model-service";
import { SuperLoginClientError } from "../../providers/super_login_client/super_login_client_error";
import { LoginPageInterface } from "./login-interface";

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
    // Todo load page

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
    // Todo load page

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
  }

  private login(email: string, password: string, rememberLogin: boolean) {
    // Todo load page

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
  }

}
