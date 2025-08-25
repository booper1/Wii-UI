import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { SlideDeckComponent } from './slide-deck/slide-deck';

@Component({
  selector: 'app-top-shelf',
  imports: [SlideDeckComponent, CommonModule],
  templateUrl: './top-shelf.html',
  styleUrl: './top-shelf.scss',
})
export class TopShelfComponent {
  protected slideService = inject(SlideService);
}
