import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {EntryListPage} from "./entry-list";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    EntryListPage
  ],
  imports: [
    IonicPageModule.forChild(EntryListPage),
    TranslateModule
  ],
  exports: [
    EntryListPage
  ]
})
export class EntryListPageModule {
}
