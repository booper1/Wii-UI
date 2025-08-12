import { Component } from '@angular/core';
import { Channel } from './components/channel/channel';
import { Clock } from './components/clock/clock';

// REFERENCE
// https://www.youtube.com/watch?v=k4Za0tkFQq8
// https://www.youtube.com/watch?v=UldvTh4BJc0

@Component({
  selector: 'app-root',
  imports: [Channel, Clock],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
