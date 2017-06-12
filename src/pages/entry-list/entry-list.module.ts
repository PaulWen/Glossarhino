import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryListPage } from './entry-list';

@NgModule({
  declarations: [
    EntryListPage
  ],
  imports: [
    IonicPageModule.forChild(EntryListPage)
  ],
  exports: [
    EntryListPage
  ]
})
export class EntryListPageModule {}
