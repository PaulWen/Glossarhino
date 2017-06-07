import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleEntryPage } from './single-entry';
import { TitleBarComponentModule } from "../../components/title-bar/title-bar.module";

@NgModule({
  declarations: [
    SingleEntryPage
  ],
  imports: [
    IonicPageModule.forChild(SingleEntryPage),
    TitleBarComponentModule
  ],
  exports: [
    SingleEntryPage
  ]
})
export class SingleEntryPageModule {}
