import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Direction, ParallaxBuilder, ParallaxDirective} from "../shared/parallax.directive";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Breakpoint} from "../../../shared/breakpoint";
import {isPlatformBrowser} from "@angular/common";
import lottie from "lottie-web";
import {ModeService} from "../../../mode/shared/mode.service";
import {RedirectService} from "../../../shared/redirect.service";
import {Modes} from "../../../mode/shared/modes";
import {TranslationService} from "../../../shared/translation.service";
import {HeaderService} from "../../../shared/header.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CategoryEntry} from "../../../shared/types/categories.types";

@Component({
  selector: 'hero-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.scss'
})
export class CategoryNavComponent implements OnInit {

  public static readonly customParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.25)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);


  @Input('parallax') parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();
  @Input('categories') categories: CategoryEntry[] = [];
  @Input('onClick') onCategoryClick: (category: CategoryEntry) => void = () => {};
  @Input('onHover') onCategoryHover: [(category: CategoryEntry) => void, (category: CategoryEntry) => void] = [() => {}, () => {}];
  @Input('isActive') isActive: (category: CategoryEntry) => boolean = () => false;

  activeCategory: CategoryEntry = this.categories[0]; // Set the first category as the active one by default

  isSmallScreen: Observable<boolean>;

  constructor(protected modeService: ModeService,
              protected redirect: RedirectService,
              private translation: TranslationService,
              protected headerService: HeaderService,
              private breakpointObserver: BreakpointObserver) {
    this.isSmallScreen = this.breakpointObserver.observe(
      [Breakpoints.Small, Breakpoints.XSmall]
    ).pipe(map(result => result.matches));
  }

  ngOnInit(): void {

  }

  protected openCategory() {
    if(this.headerService.headerComponent.isEmpty()) return;

    if(!this.headerService.headerComponent.get().categoryWindow.openState)
      this.headerService.headerComponent.get().openCategoryWindow();
    else
      this.headerService.headerComponent.get().categoryWindow.close();
  }


  protected readonly ModeService = ModeService;
}
