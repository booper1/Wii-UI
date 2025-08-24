import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BottomDeckComponent } from './components/bottom-deck/bottom-deck';
import { TopDeckComponent } from './components/top-deck/top-deck';

// REFERENCES
// https://www.youtube.com/watch?v=DTNYegBnFL0
// https://www.youtube.com/watch?v=UldvTh4BJc0
// https://www.youtube.com/watch?v=D4nQk0PiM90

@Component({
  selector: 'app-root',
  imports: [CommonModule, TopDeckComponent, BottomDeckComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
