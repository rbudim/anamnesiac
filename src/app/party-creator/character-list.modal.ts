
import { includes, sortBy } from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Character } from '../models/character';

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Choose Party Character</ion-title>
      <ion-buttons slot="end">
        <ion-button icon-only (click)="search = !search">
          <ion-icon name="search"></ion-icon>
        </ion-button>
        <ion-button (click)="dismiss()">
          Close
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <div class="stars small"></div>
    <div class="stars medium"></div>
    <div class="stars large"></div>

    <ion-searchbar *ngIf="search"
                   showCancelButton
                   (ionCancel)="closeSearch()"
                   (ionInput)="updateSearchValue($event)"
    ></ion-searchbar>

    <div class="blank-slate" *ngIf="filteredCharacters.length === 0">
      There are no characters for this region.
    </div>

    <ion-row *ngIf="filteredCharacters.length > 0">
      <ion-col text-center *ngFor="let charClass of ['attacker', 'defender', 'healer', 'invoker', 'sharpshooter']">
        <ion-button icon-only
                (click)="setRoleFilter(charClass)"
                [color]="roleFilter && roleFilter === charClass ? charClass : (roleFilter ? 'medium' : charClass)">
          <ion-img [src]="'assets/classes/' + charClass + '.png'" class="filter-icon"></ion-img>
        </ion-button>
      </ion-col>
    </ion-row>

    <ion-list *ngIf="filteredCharacters.length > 0">
      <ion-item *ngFor="let char of filteredCharacters" (click)="selectChar(char)">
        <ion-img slot="start" [src]="'assets/characters/' + char.picture + '.png'" class="mini-picture-icon"></ion-img>
        <ion-img slot="start" [src]="'assets/classes/' + char.type + '.png'" class="asset-icon"></ion-img>

        <ion-label>
          <h3>{{ char.star }}★ {{ char.name }}</h3>
        </ion-label>
      </ion-item>
    </ion-list>

  </ion-content>
  `,
  styles: [`
    .filter-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
    }
  `]
})
export class CharacterListModal implements OnInit {

  public characters: Character[] = [];
  public filteredCharacters: Character[] = [];

  public roleFilter: string;

  public search: boolean;
  public searchValue: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.search = true;
    this.characters = this.navParams.get('characters');
    this.updateFilteredCharacters();
  }

  setRoleFilter(charClass: string) {
    if(this.roleFilter === charClass) {
      this.roleFilter = '';
      this.updateFilteredCharacters();
      return;
    }

    this.roleFilter = charClass;
    this.updateFilteredCharacters();
  }

  updateSearchValue(ev) {
    if(!ev.detail) {
      this.searchValue = '';
      return;
    }
    const str = ev.target.value;
    this.searchValue = str;

    this.updateFilteredCharacters();
  }

  closeSearch() {
    this.search = false;
    this.searchValue = '';
    this.updateFilteredCharacters();
  }

  private updateFilteredCharacters() {
    let sortedChars = sortBy(this.characters, 'name');

    if(this.searchValue) {
      sortedChars = sortedChars.filter(x => includes(x.name.toLowerCase(), this.searchValue.toLowerCase()));
    }

    if(this.roleFilter) {
      sortedChars = sortedChars.filter(x => x.type === this.roleFilter);
    }

    this.filteredCharacters = sortedChars;
  }

  selectChar(char: Character) {
    this.modalCtrl.dismiss(char);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
