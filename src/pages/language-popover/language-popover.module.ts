import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {LanguagePopoverPage} from "./language-popover";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    LanguagePopoverPage
  ],
  imports: [
    IonicPageModule.forChild(LanguagePopoverPage),
    TranslateModule
  ],
  exports: [
    LanguagePopoverPage
  ]
})
export class LanguagePopoverPageModule {
}
