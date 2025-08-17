import { Channel, PreviewType } from '../models/channel.model';

/** Predefined channels shown on the Wii UI */
export const CHANNELS: Channel[] = [
  {
    id: 'booper1_website',
    title: 'Booper1 Website',
    url: 'https://booper1.github.io/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/c_logo.svg',
      backgroundColor: '#333333',
    },
  },
  {
    id: 'mii_channel',
    title: 'Mii Channel',
    url: 'https://nintendo.fandom.com/wiki/Mii_Channel',
    preview: {
      type: PreviewType.Img,
      imgPath: 'https://tinyurl.com/y3wjcxks',
    },
  },
  {
    id: 'wii_photo_channel',
    title: 'Photo Channel',
    url: 'https://nintendo.fandom.com/wiki/Photo_Channel',
    preview: {
      type: PreviewType.Img,
      imgPath: 'https://tinyurl.com/yzkpyd7x',
      preserveAspectRatio: 'xMidYMin slice',
    },
  },
  {
    id: 'wii_shop',
    title: 'Wii Shop',
    url: 'https://www.nintendo.co.uk/Support/Wii/Wii-Channels/Wii-Shop-Channel/Wii-Shop-Channel/Wii-Shop-Channel-244563.html',
    preview: {
      type: PreviewType.Img,
      imgPath: 'https://tinyurl.com/r454yswc',
    },
  },
  {
    id: 'homebrew_channel',
    title: 'Homebrew Channel',
    url: 'https://wiibrew.org/wiki/Homebrew_Channel',
    preview: {
      type: PreviewType.Img,
      imgPath: 'https://tinyurl.com/nhhresxp',
    },
  },
  {
    id: 'tfletch_website',
    title: 'TFletch Website',
    url: 'https://tfletch.tech/',
    preview: {
      type: PreviewType.Text,
      text: 'TFletch',
      backgroundColor: '#eceae7',
    },
  },
];

/** Fallback for empty/unused channels */
export const EMPTY_CHANNEL: Channel = {
  id: 'empty_channel',
  title: 'Empty Channel',
  preview: {
    type: PreviewType.Img,
    imgPath: 'assets/emptyChannel.png',
  },
};
