import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnyPreview,
  Channel,
  PreviewType,
  ImgPreview,
  SvgPreview,
  TextPreview,
} from '../../models/channel.model';

@Component({
  selector: 'app-channel',
  imports: [CommonModule],
  templateUrl: './channel.html',
  styleUrls: ['./channel.scss'],
})
export class ChannelComponent {
  @Input({ required: true }) channel!: Channel;
  @Input({ required: true }) isInactivePage!: boolean;

  protected isSvgPreview(preview: AnyPreview): preview is SvgPreview {
    return preview.type === PreviewType.Svg;
  }

  protected isImgPreview(preview: AnyPreview): preview is ImgPreview {
    return preview.type === PreviewType.Img;
  }

  protected isTextPreview(preview: AnyPreview): preview is TextPreview {
    return preview.type === PreviewType.Text;
  }

  protected get backgroundFill(): string {
    const preview = this.channel.preview;
    return this.isSvgPreview(preview) || this.isTextPreview(preview)
      ? preview.backgroundColor
      : `url(#${this.channel.id})`; // pattern reference for images
  }

  protected get resolvedImg(): string {
    const preview = this.channel.preview;
    return this.isImgPreview(preview) ? preview.imgPath : '';
  }

  protected get resolvedPreserveAspectRatio(): string {
    const preview = this.channel.preview;
    const defaultValue = 'xMidYMid slice';
    return this.isImgPreview(preview)
      ? (preview.preserveAspectRatio ?? defaultValue)
      : defaultValue;
  }

  protected get resolvedSvg(): string {
    const preview = this.channel.preview;
    return this.isSvgPreview(preview) ? preview.svgPath : '';
  }

  protected get resolvedText(): string {
    const preview = this.channel.preview;
    return this.isTextPreview(preview) ? preview.text : '';
  }
}
