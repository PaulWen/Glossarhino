import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkedObjectsModalPage } from './linked-objects-modal';

@NgModule({
  declarations: [
    LinkedObjectsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LinkedObjectsModalPage),
  ],
  exports: [
    LinkedObjectsModalPage
  ]
})
export class LinkedObjectsModalPageModule {}
