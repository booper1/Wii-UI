import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DisplayService {
  // Design size for ONE slide (viewBox units)
  public readonly SLIDE_WIDTH: number = 1728;
  public readonly SLIDE_HEIGHT: number = 1152;

  // Base geometry (design units)
  private readonly BASE_BLUE_START_Y: number = 841;
  private readonly BASE_NOTCH_DEPTH: number = 120;
  private readonly BASE_EDGE_TO_NOTCH: number = 180;
  private readonly BASE_NOTCH_CURVE_W: number = 360;
  private readonly BASE_ARC_R: number = 300; // the 'A 300 300' radius
  private readonly BASE_BORDER_SHADOW_INSIDE: number = 50;
  private readonly BASE_UNDER_SHADOW_INSIDE: number = 100;

  // Cached values
  private slideCount: number = 1;
  private previousViewportHeight: number = this.SLIDE_HEIGHT;

  // Shadows (outside excess is horizontal; scale with width)
  public shadowOutsideExcess: number = this.SLIDE_WIDTH / 5;

  // Scaled per-slide size (viewBox units after scaling)
  public slideWidth: number = this.SLIDE_WIDTH;
  public slideHeight: number = this.SLIDE_HEIGHT;

  // Full slide deck size
  public slideDeckWidth: number = this.slideWidth * this.slideCount;
  public slideDeckHeight: number = this.slideHeight;

  // Scaled geometry
  public blueStartY: number = this.BASE_BLUE_START_Y;
  public notchDepth: number = this.BASE_NOTCH_DEPTH; // vertical
  public edgeToNotch: number = this.BASE_EDGE_TO_NOTCH; // horizontal
  public notchCurveWidth: number = this.BASE_NOTCH_CURVE_W; // horizontal
  public arcR: number = this.BASE_ARC_R; // arc radius (both axes)

  public borderShadowInsideExcess: number = this.BASE_BORDER_SHADOW_INSIDE; // vertical
  public underShadowInsideExcess: number = this.BASE_UNDER_SHADOW_INSIDE; // vertical

  // Paths bound in template
  public aboveLineClip: string = '';
  public belowLineClip: string = '';
  public blueBorderLine: string = '';
  public borderShadow: string = '';
  public underShadow: string = '';

  constructor() {
    this.computeDisplay();
  }

  public relativePx(n: number) {
    return `calc(${n} / var(--originalHeight) * 100vh)`;
  }

  public configureSlideDeck(slideCount: number): void {
    this.slideCount = slideCount;
    const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
    this.previousViewportHeight = vh;
    this.computeDisplay();
  }

  public updateViewportHeight(): void {
    const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
    this.previousViewportHeight = vh;
    this.computeDisplay();
  }

  private get scale(): number {
    const vh = this.previousViewportHeight || this.SLIDE_HEIGHT;
    return vh / this.SLIDE_HEIGHT;
  }

  // Build one slide segment of the border
  private buildBorderSegment(
    segmentStartX: number,
    isShadow: boolean = false,
  ): string {
    // X positions
    const leftEdgeX = segmentStartX;
    const rightEdgeX = segmentStartX + this.slideWidth;
    const leftStraightEndX = leftEdgeX + this.edgeToNotch;
    const notchLeftMidX = leftStraightEndX + this.notchCurveWidth / 2;
    const notchLeftEndX = leftStraightEndX + this.notchCurveWidth;
    const bottomMidX = segmentStartX + this.slideWidth / 2;
    const notchRightStartX =
      rightEdgeX - this.edgeToNotch - this.notchCurveWidth;
    const notchRightMidX =
      rightEdgeX - this.edgeToNotch - this.notchCurveWidth / 2;
    const notchRightEndX = rightEdgeX - this.edgeToNotch;

    // Y positions
    const yTop = isShadow
      ? this.blueStartY + this.borderShadowInsideExcess
      : this.blueStartY;
    const yMid = yTop + this.notchDepth / 2;
    const yBottom = yTop + this.notchDepth;

    // Arc radius
    const r = this.arcR;

    return `
      L ${leftStraightEndX} ${yTop}
      A ${r} ${r} 0 0 1 ${notchLeftMidX} ${yMid}
      A ${r} ${r} 0 0 0 ${notchLeftEndX} ${yBottom}
      L ${bottomMidX} ${yBottom}
      L ${notchRightStartX} ${yBottom}
      A ${r} ${r} 0 0 0 ${notchRightMidX} ${yMid}
      A ${r} ${r} 0 0 1 ${notchRightEndX} ${yTop}
      L ${rightEdgeX} ${yTop}
    `;
  }

  private computeDisplay(): void {
    // Scaled geometry
    this.slideHeight = this.SLIDE_HEIGHT * this.scale;
    this.slideWidth = this.SLIDE_WIDTH * this.scale;
    this.blueStartY = this.BASE_BLUE_START_Y * this.scale;
    this.notchDepth = this.BASE_NOTCH_DEPTH * this.scale;
    this.edgeToNotch = this.BASE_EDGE_TO_NOTCH * this.scale;
    this.notchCurveWidth = this.BASE_NOTCH_CURVE_W * this.scale;
    this.arcR = this.BASE_ARC_R * this.scale;
    this.borderShadowInsideExcess = this.BASE_BORDER_SHADOW_INSIDE * this.scale;
    this.underShadowInsideExcess = this.BASE_UNDER_SHADOW_INSIDE * this.scale;

    // Deck size
    this.slideDeckHeight = this.slideHeight;
    this.slideDeckWidth = this.slideWidth * this.slideCount;

    // Update shadows
    this.shadowOutsideExcess = this.slideWidth / 5;

    // Rebuild paths across all slideCount using the scaled slide width
    let bluePath = `M 0 ${this.blueStartY}`;
    for (let i = 0; i < this.slideCount; i++) {
      const startX = i * this.slideWidth;
      bluePath += ` ${this.buildBorderSegment(startX)}`;
    }
    this.blueBorderLine = bluePath;

    this.aboveLineClip = `
      M 0 0
      ${bluePath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth} 0
      Z
    `;

    this.belowLineClip = `
      M 0 ${this.slideDeckHeight}
      ${bluePath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth} ${this.slideDeckHeight}
      Z
    `;

    // Border shadow path
    let innerPath = `M 0 ${this.blueStartY + this.borderShadowInsideExcess}`;
    for (let i = 0; i < this.slideCount; i++) {
      const startX = i * this.slideWidth;
      innerPath += ` ${this.buildBorderSegment(startX, true)}`;
    }
    this.borderShadow = `
      M ${this.slideDeckWidth + this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
      L ${-this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
      L ${-this.shadowOutsideExcess} ${this.blueStartY + this.borderShadowInsideExcess}
      ${innerPath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth + this.shadowOutsideExcess} ${this.blueStartY + this.borderShadowInsideExcess}
      L ${this.slideDeckWidth + this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
    `;

    this.underShadow = `
      M ${this.slideDeckWidth + this.shadowOutsideExcess} ${this.slideDeckHeight + this.shadowOutsideExcess}
      L ${this.slideDeckWidth + this.shadowOutsideExcess} ${this.slideDeckHeight - this.underShadowInsideExcess}
      L ${-this.shadowOutsideExcess} ${this.slideDeckHeight - this.underShadowInsideExcess}
      L ${-this.shadowOutsideExcess} ${this.slideDeckHeight + this.shadowOutsideExcess}
      Z
    `;
  }
}
