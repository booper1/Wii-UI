import { Channel, PreviewType } from '../models/channel.model';

/** Predefined channels shown on the Wii UI */
export const CHANNELS: Channel[] = [
  {
    id: 'booper1_website',
    title: 'Booper_1 Wii UI',
    url: '',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/wiiLogo.svg',
      backgroundColor: '#ffffff',
    },
  },
  {
    id: 'booper1_resume',
    title: 'Booper_1 Resume',
    url: 'assets/cooperBaumgarthResume2025.pdf',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/documentIcon.svg',
      backgroundColor: '#f5f5f5',
    },
  },
  {
    id: 'booper1_linkedin',
    title: 'Booper_1 LinkedIn',
    url: 'https://www.linkedin.com/in/cooperbaumgarth/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/linkedinLogo.svg',
      backgroundColor: '#0270ad',
      scale: 1.1,
    },
  },
  {
    id: 'booper1_github',
    title: 'Booper_1 GitHub',
    url: 'https://github.com/booper1',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/githubLogo.svg',
      backgroundColor: '#1b1f24',
      scale: 1.1,
    },
  },
  {
    id: 'tfletch_website',
    title: 'TFletch Website',
    url: 'https://tfletch.tech/',
    preview: {
      type: PreviewType.Text,
      text: 'TFletch',
      backgroundColor: '#d4d0c9',
      textColor: '#333333',
    },
  },
  {
    id: 'quinnjam.es',
    title: 'QJames Website',
    url: 'https://quinnjam.es/',
    preview: {
      type: PreviewType.Text,
      text: 'quinnjam',
      backgroundColor: '#101110',
      textColor: '#ffffff',
    },
  },
  {
    id: 'wii_shop',
    title: 'Wii Shop',
    url: 'https://www.youtube.com/watch?v=yyjUmv1gJEg',
    preview: {
      type: PreviewType.Img,
      imgPath: 'assets/wiiShop.jpg',
    },
  },
  {
    id: 'homebrew_channel',
    title: 'Homebrew Channel',
    url: 'https://wiibrew.org/wiki/Homebrew_Channel',
    preview: {
      type: PreviewType.Img,
      imgPath: 'assets/homebrew.png',
    },
  },
  {
    id: 'youtube',
    title: 'YouTube',
    url: 'https://youtube.com',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/youtubeLogo.svg',
      backgroundColor: '#ffffff',
      scale: 1.7,
    },
  },
  {
    id: 'wordle',
    title: 'Wordle',
    url: 'https://www.nytimes.com/games/wordle/index.html',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/wordleLogo.svg',
      backgroundColor: '#e3e3e1',
    },
  },
  {
    id: 'nytSudoku',
    title: 'New York Times Sudoku',
    url: 'https://www.nytimes.com/puzzles/sudoku',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/nytSudokuLogo.svg',
      backgroundColor: '#fb9b00',
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
