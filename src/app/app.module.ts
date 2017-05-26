import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ModelProvider} from "../providers/model/model";
import {MyErrorHandler} from "./my-error-handler";
import {SuperloginHttpRequestor} from "../providers/super_login_client/superlogin_http_requestor";
import {SuperLoginClientDatabaseInitializer} from "../providers/super_login_client/super_login_client_database_initializer";
import {SuperLoginClient} from "../providers/super_login_client/super_login_client";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    SuperloginHttpRequestor,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    ModelProvider,
    {provide: SuperLoginClientDatabaseInitializer, useClass: ModelProvider},
    SuperLoginClient
  ]
})
export class AppModule {}
