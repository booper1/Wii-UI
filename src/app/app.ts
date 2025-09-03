import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomShelfComponent } from './components/bottom-shelf/bottom-shelf';
import { TopShelfComponent } from './components/top-shelf/top-shelf';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TopShelfComponent, BottomShelfComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  // Pause animations so that they don't run while the tab is inactive
  // Primarily for the intro sequence
  ngOnInit() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.documentElement.classList.add('paused-animations');
      } else {
        document.documentElement.classList.remove('paused-animations');
      }
    });
  }
}
