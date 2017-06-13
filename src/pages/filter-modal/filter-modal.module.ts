import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterModalPage } from './filter-modal';

@NgModule({
  declarations: [
    FilterModalPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterModalPage),
  ],
  exports: [
    FilterModalPage
  ]
})
export class FilterModalPageModule {}
