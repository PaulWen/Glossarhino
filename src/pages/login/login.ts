import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {SuperLoginClient} from "../../providers/super_login_client/super_login_client";
import {SuperLoginClientError} from "../../providers/super_login_client/super_login_client_error";
import {Logger} from "../../app/logger";

/**
 * LoginPage where the user authenticates itself and is also able to create a new account.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

////////////////////////////////////////////Properties/////////////////////////////////////////////

  private superLoginClient: SuperLoginClient;

  private loginOpened: boolean;

////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(private navCtrl: NavController, private navParams: NavParams, superLoginClient: SuperLoginClient) {
    this.superLoginClient = superLoginClient;
    this.loginOpened = true;
  }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private register(email: string, password: string, confirmPassword: string, rememberLogin: boolean) {
    Logger.log("Register: " + email + "; " + password + "; " + confirmPassword + "; " + rememberLogin);

    this.superLoginClient.register(email, password, confirmPassword, () => {
      // successfully registred
      this.navCtrl.push("HomePage");

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

    this.superLoginClient.loginWithCredentials(email, password, rememberLogin, () => {
      // successfully loged-in
      this.navCtrl.push("HomePage");

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
