import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {LanguagePopoverPage} from "./language-popover";

@NgModule({
  declarations: [
    LanguagePopoverPage
  ],
  imports: [
    IonicPageModule.forChild(LanguagePopoverPage)
  ],
  exports: [
    LanguagePopoverPage
  ]
})
export class LanguagePopoverPageModule {
}
