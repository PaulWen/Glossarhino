import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { TitleBarComponentModule } from "../../components/title-bar/title-bar.module";

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    TitleBarComponentModule
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule {}
