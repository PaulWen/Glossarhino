import {ErrorHandler, NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {IonicApp, IonicErrorHandler, IonicModule, Keyboard} from "ionic-angular";
import {AppModelService} from "../providers/app-model-service";
import {SuperloginHttpRequester} from "../providers/super_login_client/superlogin_http_requester";
import {MyApp} from "./app.component";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          scrollAssist: false,
          autoFocusAssist: false
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SuperloginHttpRequester,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppModelService,
    Keyboard
  ]
})
export class AppModule {
}
