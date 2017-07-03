import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SingleEntryPage} from "./single-entry";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SingleEntryPage
  ],
  imports: [
    IonicPageModule.forChild(SingleEntryPage),
    TranslateModule
  ],
  exports: [
    SingleEntryPage
  ]
})
export class SingleEntryPageModule {
}
