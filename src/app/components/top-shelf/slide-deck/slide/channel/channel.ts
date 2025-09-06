import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';
import {
  AnyPreview,
  Channel,
  ImgPreview,
  PreviewType,
  SvgPreview,
  TextPreview,
} from '../../../../../models/channel.model';
import { DisplayService } from '../../../../../services/display.service';
import { SlideService } from '../../../../../services/slide.service';

@Component({
  selector: 'app-channel',
  imports: [CommonModule],
  templateUrl: './channel.html',
  styleUrls: ['./channel.scss'],
})
export class ChannelComponent {
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);

  @Input({ required: true }) public channel!: Channel;
  @Input({ required: true }) public slideIndex!: number;
  @Input({ required: true }) public isIntroSlide!: boolean;
  @Input({ required: true }) public introDelay!: number;

  protected innerSvgDefaultSize: number = 300;

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
    const preview: AnyPreview = this.channel.preview;
    return this.isSvgPreview(preview) || this.isTextPreview(preview)
      ? preview.backgroundColor
      : `url(#${this.channel.id})`;
  });

  protected readonly resolvedImg: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel.preview;
    return this.isImgPreview(preview) ? preview.imgPath : '';
  });

  protected readonly resolvedPreserveAspectRatio: Signal<string> = computed(
    () => {
      const preview: AnyPreview = this.channel.preview;
      const defaultValue: string = 'xMidYMid slice';
      return this.isImgPreview(preview)
        ? (preview.preserveAspectRatio ?? defaultValue)
        : defaultValue;
    },
  );

  protected readonly resolvedSvg: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel.preview;
    return this.isSvgPreview(preview) ? preview.svgPath : '';
  });

  protected readonly resolvedSvgScale: Signal<number> = computed(() => {
    const preview: AnyPreview = this.channel.preview;
    const defaultValue: number = 1;
    return this.isSvgPreview(preview)
      ? (preview.scale ?? defaultValue)
      : defaultValue;
  });

  protected readonly resolvedText: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel.preview;
    return this.isTextPreview(preview) ? preview.text : '';
  });

  protected readonly resolvedTextColor: Signal<string> = computed(() => {
    const preview: AnyPreview = this.channel.preview;
    const defaultValue: string = '#000000';
    return this.isTextPreview(preview)
      ? (preview.textColor ?? defaultValue)
      : defaultValue;
  });
}
