import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  Signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { EMPTY_CHANNEL } from '../../../../constants/channels.data';
import {
  AnyPreview,
  Channel,
  ImgPreview,
  PreviewType,
  SvgPreview,
  TextPreview,
} from '../../../../models/channel.model';
import { DisplayService } from '../../../../services/display.service';
import { SlideService } from '../../../../services/slide.service';
import { ZoomService } from '../../../../services/zoom.service';

@Component({
  selector: 'app-channel',
  imports: [CommonModule, PortalModule],
  templateUrl: './channel.html',
  styleUrls: ['./channel.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelComponent {
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);
  protected zoomService: ZoomService = inject(ZoomService);

  @ViewChild('channelPortal') channelPortal!: TemplatePortal;
  @ViewChild('channelRoot') channelRoot!: ElementRef<HTMLElement>;

  public channel = input.required<Channel>();
  public slideIndex = input.required<number>();
  public isIntroSlide = input.required<boolean>();
  public introDelay = input.required<number>();

  protected readonly isCurrentSlide: Signal<boolean> = computed(
    () => !this.isIntroSlide() && this.slideIndex() === this.slideService.currentSlideIndex(),
  );

  protected readonly viewBoxWidth: number = 1000;
  protected readonly viewBoxHeight: number = 550;
  protected readonly innerSvgDefaultSize: number = 300;

  protected readonly innerButtonCenterX: number[] = [336, 664];
  protected readonly innerButtonCenterY: number = 468;
  protected readonly innerButtonWidth: number = 285;
  protected readonly innerButtonHeight: number = 78;

  protected readonly channelPath: string = `
    M 500 544
    L 281 544
    C -14 540 10 564 6 275
    C 10 -14 -14 10 281 6
    L 719 6
    C 1014 10 990 -14 994 275
    C 990 564 1014 540 719 544
    Z
  `;

  ngAfterViewInit(): void {
    this.zoomService.registerChannelOrigin(this.channel().id, this.channelPortal, this.channelRoot.nativeElement);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.zoomService.activeChannelId() === this.channel().id) {
      this.zoomService.onZoomResize(this.channel().id);
    }
  }

  protected isSvgPreview(preview: AnyPreview): preview is SvgPreview {
    return preview.type === PreviewType.Svg;
  }

  protected isImgPreview(preview: AnyPreview): preview is ImgPreview {
    return preview.type === PreviewType.Img;
  }

  protected isTextPreview(preview: AnyPreview): preview is TextPreview {
    return preview.type === PreviewType.Text;
  }

  protected readonly resolvedBackgroundFill: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    return this.isSvgPreview(preview) || this.isTextPreview(preview)
      ? preview.backgroundColor
      : `url(#${this.channel().id})`;
  });

  protected readonly resolvedImg: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    return this.isImgPreview(preview) ? preview.imgPath : '';
  });

  protected readonly resolvedPreserveAspectRatio: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    const defaultValue: string = 'xMidYMid slice';
    return this.isImgPreview(preview) ? (preview.preserveAspectRatio ?? defaultValue) : defaultValue;
  });

  protected readonly resolvedSvg: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    return this.isSvgPreview(preview) ? preview.svgPath : '';
  });

  protected readonly resolvedSvgScale: Signal<number> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    const defaultValue: number = 1;
    return this.isSvgPreview(preview) ? (preview.scale ?? defaultValue) : defaultValue;
  });

  protected readonly resolvedText: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    return this.isTextPreview(preview) ? preview.text : '';
  });

  protected readonly resolvedTextColor: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel().preview;
    const defaultValue: string = '#000000';
    return this.isTextPreview(preview) ? (preview.textColor ?? defaultValue) : defaultValue;
  });

  protected onChannelClick(): void {
    if (
      !this.zoomService.isZoomActive() &&
      ((this.isCurrentSlide() && !this.channel().id.startsWith(EMPTY_CHANNEL.id)) ||
        this.zoomService.activeChannelId() === this.channel().id)
    ) {
      this.zoomService.toggleChannelZoom(this.channel().id);
    }
  }

  protected onWiiMenuClick(): void {
    if (
      (this.isCurrentSlide() && !this.channel().id.startsWith(EMPTY_CHANNEL.id)) ||
      this.zoomService.activeChannelId() === this.channel().id
    ) {
      this.zoomService.toggleChannelZoom(this.channel().id);
    }
  }

  protected onStartClick(): void {
    if (this.channel().url) {
      window.open(this.channel().url, '_blank');
    }
  }

  protected pressedLeft: WritableSignal<boolean> = signal(false);
  protected pressedRight: WritableSignal<boolean> = signal(false);

  // Pointer helpers so pressed state never gets stuck
  protected onPointerDown(buttonSide: 'left' | 'right'): void {
    if (buttonSide === 'left') {
      this.pressedLeft.set(true);
    } else {
      this.pressedRight.set(true);
    }
  }

  protected onPointerCancel(buttonSide: 'left' | 'right'): void {
    if (buttonSide === 'left') {
      this.pressedLeft.set(false);
    } else {
      this.pressedRight.set(false);
    }
  }
}
