import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowWordPage } from './show-word';

@NgModule({
  declarations: [
    ShowWordPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowWordPage),
  ],
  exports: [
    ShowWordPage
  ]
})
export class ShowWordPageModule {}
