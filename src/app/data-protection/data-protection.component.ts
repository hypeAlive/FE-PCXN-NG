import { Component } from '@angular/core';
import {DefaultBGComponent} from "../section/hero/default-bg/default-bg.component";
import {HeroModule} from "../section/hero/hero.module";
import {HeaderService, MenuActives} from "../shared/header.service";
import {RedirectService} from "../shared/redirect.service";

@Component({
  selector: 'app-data-protection',
  standalone: true,
  imports: [
    DefaultBGComponent,
    HeroModule
  ],
  templateUrl: './data-protection.component.html',
  styleUrl: './data-protection.component.scss'
})
export class DataProtectionComponent {

  constructor(private headerService: HeaderService, private redirect: RedirectService) {
    this.headerService.init(
      "pcxn.subsite.data-protection.sectionTitle",
      false,
      false,
      MenuActives.DATA_PROTECTION
    );
  }

}
