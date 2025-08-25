import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BottomShelfComponent } from './components/bottom-shelf/bottom-shelf';
import { TopShelfComponent } from './components/top-shelf/top-shelf';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TopShelfComponent, BottomShelfComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
