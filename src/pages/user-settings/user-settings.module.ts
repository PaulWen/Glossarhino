import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFilterPage } from './user-settings';

@NgModule({
  declarations: [
    UserFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(UserFilterPage)
  ],
  exports: [
    UserFilterPage
  ]
})
export class UserSettingsPageModule {}
