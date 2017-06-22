import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {LanguagePopoverPage} from "./language-popover";
import { FormsModule } from "@angular/forms/forms";

@NgModule({
  declarations: [
    LanguagePopoverPage
  ],
  imports: [
    IonicPageModule.forChild(LanguagePopoverPage),
    FormsModule
  ],
  exports: [
    LanguagePopoverPage
  ]
})
export class LanguagePopoverPageModule {
}
