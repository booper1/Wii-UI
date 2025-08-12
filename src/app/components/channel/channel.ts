import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel.html',
  styleUrls: ['./channel.scss'],
})
export class Channel implements OnInit {
  @Input() title: string = 'emptyChannel';
  @Input() bgColor?: string;
  @Input() image?: string;
  @Input() par: string = 'xMidYMid slice';
  @Input() link: string = '';
  @Input() innerContentType?: 'icon' | 'text';
  @Input() innerContent?: string;

  private readonly imported: Record<string, string> = {
    emptyChannel: 'assets/emptyChannel.png',
    c_logo: 'assets/c_logo.svg',
  };

  get resolvedImage(): string {
    return this.image ?? this.imported[this.title ?? 'emptyChannel'];
  }

  get resolvedInnerContent(): string {
    return this.imported[this.innerContent ?? 'emptyChannel'];
  }

  ngOnInit(): void {
    if (!this.bgColor) {
      this.bgColor = `url(#${this.title})`;
    }
  }
}
