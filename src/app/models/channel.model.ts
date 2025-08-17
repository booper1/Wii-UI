export interface Channel {
  id: string;
  title: string;
  url?: string;
  preview: AnyPreview;
}

export enum PreviewType {
  Img = 'img',
  Svg = 'svg',
  Text = 'text',
}

export type AnyPreview = ImgPreview | SvgPreview | TextPreview;

export interface ImgPreview {
  type: PreviewType.Img;
  imgPath: string;
  preserveAspectRatio?: string;
}

export interface SvgPreview {
  type: PreviewType.Svg;
  svgPath: string;
  backgroundColor: string;
  scale?: number;
}

export interface TextPreview {
  type: PreviewType.Text;
  text: string;
  backgroundColor: string;
  textColor?: string;
}
