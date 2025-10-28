import { Channel, PreviewType } from '../models/channel.model';

export const CHANNELS: Channel[] = [
  {
    id: 'booper1_linkedin',
    title: 'My LinkedIn',
    url: 'https://www.linkedin.com/in/cooperbaumgarth/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/linkedinLogo.svg',
      backgroundColor: '#0270ad',
      scale: 1.375,
    },
  },
  {
    id: 'booper1_github',
    title: 'My GitHub',
    url: 'https://github.com/booper1',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/githubLogo.svg',
      backgroundColor: '#1b1f24',
      scale: 1.2,
    },
  },
  {
    id: 'gmail',
    title: 'Gmail',
    url: 'https://mail.google.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/gmailLogo.svg',
      backgroundColor: '#f8fafd',
      scale: 1.1,
    },
  },
  {
    id: 'googleDrive',
    title: 'Google Drive',
    url: 'https://drive.google.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/googleDriveLogo.svg',
      backgroundColor: '#f8fafd',
      scale: 1.1,
    },
  },
  {
    id: 'weatherChannel',
    title: 'Weather Channel',
    url: 'https://weather.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/weatherChannelLogo.svg',
      backgroundColor: '#ffffff',
      scale: 1,
    },
  },
  {
    id: 'reddit',
    title: 'Reddit',
    url: 'https://www.reddit.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/redditLogo.svg',
      backgroundColor: '#ff4500',
      scale: 1.3,
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
    id: 'spotify',
    title: 'Spotify Web Player',
    url: 'https://open.spotify.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/spotifyLogo.svg',
      backgroundColor: '#191414',
      scale: 1.5,
    },
  },
  {
    id: 'netflix',
    title: 'Netflix',
    url: 'https://www.netflix.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/netflixLogo.svg',
      backgroundColor: '#ffffff',
      scale: 1.8,
    },
  },
  {
    id: 'twitch',
    title: 'Twitch',
    url: 'https://www.twitch.tv/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/twitchLogo.svg',
      backgroundColor: '#6441a4',
      scale: 1.4,
    },
  },
  {
    id: 'steam',
    title: 'Steam',
    url: 'https://store.steampowered.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/steamLogo.svg',
      backgroundColor: '#1b2838',
      scale: 1,
    },
  },
  {
    id: 'amazon',
    title: 'Amazon',
    url: 'https://www.amazon.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/amazonLogo.svg',
      backgroundColor: '#ffffff',
      scale: 1,
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
      scale: 1,
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
      scale: 1,
    },
  },
  {
    id: 'geoguessr',
    title: 'GeoGuessr',
    url: 'https://www.geoguessr.com/',
    preview: {
      type: PreviewType.Svg,
      svgPath: 'assets/geoguessrLogo.svg',
      backgroundColor: '#ffffff',
      scale: 2,
    },
  },
];

// Fallback for empty/unused channel slots
export const EMPTY_CHANNEL: Channel = {
  id: 'empty_channel',
  title: 'Empty Channel',
  preview: {
    type: PreviewType.Img,
    imgPath: 'assets/emptyChannel.png',
  },
};
