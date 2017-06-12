import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SuperloginHttpRequestor} from "../providers/super_login_client/superlogin_http_requestor";
import {SuperLoginClient} from "../providers/super_login_client/super_login_client";
import {AppModelService} from "../providers/model/app-model-service";
import {SuperLoginClientDatabaseInitializer} from "../providers/super_login_client/super_login_client_database_initializer";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,
    ),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SuperloginHttpRequestor,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SuperLoginClient,
    AppModelService
  ]
})
export class AppModule { }
