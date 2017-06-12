import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SuperloginHttpRequestor} from "../providers/super_login_client/superlogin_http_requestor";
import {SuperLoginClient} from "../providers/super_login_client/super_login_client";
import {AppModelService} from "../providers/model/app-model-service";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
