import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { SlideDeckComponent } from '../slide-deck/slide-deck';

@Component({
  selector: 'app-top-deck',
  imports: [SlideDeckComponent, CommonModule],
  templateUrl: './top-deck.html',
  styleUrl: './top-deck.scss',
})
export class TopDeckComponent {
  slideService = inject(SlideService);
}
