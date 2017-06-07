import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryListPage } from './entry-list';
import { TitleBarComponentModule } from "../../components/title-bar/title-bar.module";

@NgModule({
  declarations: [
    EntryListPage
  ],
  imports: [
    IonicPageModule.forChild(EntryListPage),
    TitleBarComponentModule
  ],
  exports: [
    EntryListPage
  ]
})
export class EntryListPageModule {}
