import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleEntryTabsPage } from './single-entry-tabs';

@NgModule({
  declarations: [
    SingleEntryTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleEntryTabsPage),
  ],
  exports: [
    SingleEntryTabsPage
  ]
})
export class SingleEntryTabsPageModule {}
