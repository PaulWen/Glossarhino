import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleEntryPage } from './single-entry';

@NgModule({
  declarations: [
    SingleEntryPage
  ],
  imports: [
    IonicPageModule.forChild(SingleEntryPage)
  ],
  exports: [
    SingleEntryPage
  ]
})
export class SingleEntryPageModule {}
