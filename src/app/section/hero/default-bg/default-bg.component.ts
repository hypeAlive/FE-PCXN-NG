import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HeroModule} from "../hero.module";
import {NgClass, NgIf} from "@angular/common";
import {ParallaxBuilder} from "../shared/parallax.directive";
import {Themes, ThemeService} from "../../../shared/theme.service";
import {Optional} from "../../../shared/optional";
import {ImageComponent} from "../image/image.component";

@Component({
  selector: 'hero-default-bg',
  standalone: true,
  imports: [
    HeroModule,
    NgIf,
    NgClass
  ],
  templateUrl: './default-bg.component.html',
  styleUrl: './default-bg.component.scss'
})
export class DefaultBGComponent implements OnInit, AfterViewInit {

  protected moonParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.8)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected cloudParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.9)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected cloudParallaxFront: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.4)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected pictureParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.3)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("left")
    .setScrollStart(0)
    .setPosition(0);

  @ViewChild('moon') moon: ElementRef | undefined;
  @ViewChild('moonPic') moonPic: ImageComponent | undefined;
  @ViewChild('sunPic') sunPic: ImageComponent | undefined;
  @ViewChild('cloud1') cloud1: ImageComponent | undefined;
  @ViewChild('cloud2') cloud2: ImageComponent | undefined;

  protected darkMode: Optional<boolean> = Optional.empty();

  protected showMoon: boolean = false;

  constructor(protected theme: ThemeService, private renderer: Renderer2) {
    this.darkMode = Optional.of(this.theme.darkMode);
  }

  private calcMoonPosition(): void {
    if (this.moon == undefined) return;

    if (this.theme.is(Themes.Auto) && this.theme.getAutoModeHour().isPresent()) {
      let hour = this.theme.getAutoModeHour().get();
      let left = 100 / 12 * hour;
      let top = Math.round(6 / 6 * hour - 6);
      this.renderer.setStyle(this.moon.nativeElement, 'left', `${left}%`);
      this.renderer.setStyle(this.moon.nativeElement, 'rotate', `${top}deg`);
      this.renderer.setStyle(this.moon.nativeElement, 'top', `${top > 0 ? top * 2 : top}%`);
    } else {
      this.renderer.setStyle(this.moon.nativeElement, 'left', `50%`);
      this.renderer.setStyle(this.moon.nativeElement, 'rotate', `${0}deg`);
      this.renderer.setStyle(this.moon.nativeElement, 'top', `${0}%`);
    }
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.theme.subscribe(theme => {
        this.darkMode = Optional.of(theme);

        this.darkMode.ifPresent(darkMode => {
          if (darkMode) {
            if (this.moonPic != undefined && this.sunPic != undefined) {
              this.moonPic.show();
              this.sunPic.hide();
              this.cloud1?.hide();
              this.cloud2?.hide();
            }
          } else {
            if (this.moonPic != undefined && this.sunPic != undefined) {
              this.sunPic.show();
              this.moonPic.hide();
              this.cloud1?.show();
              this.cloud2?.show();
            }
          }
        });

        this.calcMoonPosition();
      });

      this.showMoon = true;
    });
  }

  ngOnInit(): void {
  }

  protected isDarkMode(): boolean {
    return this.showMoon && this.darkMode.orElse(false);
  }

  protected hideOnDarkMode(): boolean {
    return !this.showMoon || this.darkMode.orElse(true);
  }

  protected hideOnLightMode(): boolean {
    return !this.showMoon || !this.darkMode.orElse(false);
  }

  protected isLightMode(): boolean {
    return this.showMoon && !this.darkMode.orElse(true);
  }

}
