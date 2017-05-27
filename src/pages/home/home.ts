import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingleArticlePage } from '../single-article/single-article';

export interface HomePage {
 get 
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  singleArticlePage = SingleArticlePage;

  public toggled: boolean;

  constructor(public navCtrl: NavController) {
    this.toggled = false;
  }

  toggleSearch() {
       this.toggled = this.toggled ? false : true;
  }

  onInput (event: Event) {
    this.toggleSearch()
  }

  onCancel (event: Event) {
    this.toggleSearch()
  }

}
