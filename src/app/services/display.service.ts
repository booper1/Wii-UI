import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { SHARED_DESIGN } from '../constants/shared-design.data';
import { ChannelGrid } from '../models/channel-grid.model';

@Injectable({ providedIn: 'root' })
export class DisplayService {
  // Design size for one slide
  private readonly DESIGN_SLIDE_WIDTH: number = 1728;
  private readonly DESIGN_SLIDE_HEIGHT: number = 1152;

  // Base geometry
  private readonly DESIGN_BORDER_START_Y: number = this.DESIGN_SLIDE_HEIGHT - SHARED_DESIGN.BOTTOM_SHELF_HEIGHT;
  private readonly DESIGN_NOTCH_DEPTH: number = 120;
  private readonly DESIGN_EDGE_TO_NOTCH: number = 180;
  private readonly DESIGN_NOTCH_CURVE_W: number = 360;
  private readonly DESIGN_ARC_R: number = 300; // the 'A 300 300' radius
  private readonly DESIGN_BORDER_SHADOW_INSIDE: number = 50;
  private readonly DESIGN_UNDER_SHADOW_INSIDE: number = 100;

  // Channel grid
  private readonly CHANNEL_ASPECT: number = 20 / 11;
  private readonly DESIGN_CHANNEL_GAP: number = 12;
  private readonly DESIGN_GRID_TOP_CLEARANCE: number = 28 * 2;
  private readonly DESIGN_GRID_BOTTOM_CLEARANCE: number = 28;

  // Clock
  private readonly DESIGN_CLOCK_FONT: number = 136;
  private readonly DESIGN_CLOCK_SPACING_FROM_GRID_PX: number = 24;
  private readonly CLOCK_ANCHOR_TOP: number = 0.48;
  private readonly CLOCK_TOP_NUDGE: number = -6;
  private readonly DESIGN_CLOCK_OFFSET_PX: number = this.computeDesignClockOffsetPx();

  // Cached values
  private slideCount: WritableSignal<number> = signal(1);
  public currentVH: WritableSignal<number> = signal(SHARED_DESIGN.STAGE_HEIGHT);
  public currentVW: WritableSignal<number> = signal(SHARED_DESIGN.STAGE_WIDTH);

  private readonly GRID_CENTERING_WEIGHT: number = 2 / 3;

  // Shadows (outside excess is horizontal; scales with width)
  public shadowOutsideExcess: WritableSignal<number> = signal(this.DESIGN_SLIDE_WIDTH / 5);

  // Scaled per-slide size
  public slideWidth: WritableSignal<number> = signal(this.DESIGN_SLIDE_WIDTH);
  public slideHeight: WritableSignal<number> = signal(this.DESIGN_SLIDE_HEIGHT);
  public readonly slideDeckSvgWidth: Signal<number> = computed(() => {
    return this.slideWidth() * 4;
  });

  // Full slide deck size
  public slideDeckWidth: WritableSignal<number> = signal(this.slideWidth() * this.slideCount());
  public slideDeckHeight: WritableSignal<number> = signal(this.slideHeight());

  // Scaled geometry
  public borderStartY: WritableSignal<number> = signal(this.DESIGN_BORDER_START_Y);
  public notchDepth: WritableSignal<number> = signal(this.DESIGN_NOTCH_DEPTH);
  public edgeToNotch: WritableSignal<number> = signal(this.DESIGN_EDGE_TO_NOTCH);
  public notchCurveWidth: WritableSignal<number> = signal(this.DESIGN_NOTCH_CURVE_W);
  public readonly bottomShelfHeight: Signal<number> = computed(() => {
    return this.slideHeight() - this.borderStartY();
  });

  // Arc radii
  public arcRx: WritableSignal<number> = signal(this.DESIGN_ARC_R);
  public arcRy: WritableSignal<number> = signal(this.DESIGN_ARC_R);

  public borderShadowInsideExcess: WritableSignal<number> = signal(this.DESIGN_BORDER_SHADOW_INSIDE);
  public underShadowInsideExcess: WritableSignal<number> = signal(this.DESIGN_UNDER_SHADOW_INSIDE);

  // Paths bound in template
  public aboveLineClipPath: WritableSignal<string> = signal<string>('');
  public belowLineClipPath: WritableSignal<string> = signal<string>('');
  public blueBorderLinePath: WritableSignal<string> = signal<string>('');
  public borderShadowPath: WritableSignal<string> = signal<string>('');
  public lowerShadowPath: WritableSignal<string> = signal<string>('');
  public bottomDeckClipPath: WritableSignal<string> = signal<string>('');

  public channelGrid: WritableSignal<ChannelGrid> = signal({
    cols: 4,
    rows: 3,
    capacity: 12,
    channelWidth: this.DESIGN_SLIDE_WIDTH / 4,
    channelHeight: this.DESIGN_SLIDE_WIDTH / 4 / this.CHANNEL_ASPECT,
  });

  public channelGridTopPx: WritableSignal<number> = signal<number>(this.DESIGN_GRID_TOP_CLEARANCE);

  // Clock outputs
  public clockTopPx: WritableSignal<number> = signal<number>(0);
  public clockScaleFactor: WritableSignal<number> = signal<number>(1);

  public readonly channelGapPx: Signal<number> = computed(() => this.DESIGN_CHANNEL_GAP * this.scaleY);

  public introTotalTime: WritableSignal<number> = signal<number>(0);

  constructor() {
    this.computeDisplay();
  }

  public relativePx(n: number): string {
    return `calc(${n} / var(--designHeight) * 100dvh)`;
  }

  public cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  }

  public parseCssDuration(varName: string): number {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

    if (value.endsWith('ms')) return parseFloat(value);
    if (value.endsWith('s')) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  }

  public configureSlideDeck(slideCount: number): void {
    this.slideCount.set(slideCount);
    const vh: number = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const vw: number = Math.round(window.visualViewport?.width ?? window.innerWidth);
    this.currentVH.set(vh);
    this.currentVW.set(vw);
    this.computeDisplay();
  }

  public updateViewport(): void {
    const vh: number = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const vw: number = Math.round(window.visualViewport?.width ?? window.innerWidth);
    this.currentVH.set(vh);
    this.currentVW.set(vw);

    this.computeDisplay();
  }

  // Check if viewport is skinnier than design aspect ratio
  private get isViewportSkinnier(): boolean {
    return this.currentVW() / this.currentVH() < SHARED_DESIGN.ASPECT_RATIO;
  }

  private get scaleY(): number {
    // Height always fills viewport
    return this.currentVH() / this.DESIGN_SLIDE_HEIGHT;
  }

  // Width only shrinks when skinnier than 16:9, otherwise match height scale
  private get scaleX(): number {
    const stageScale: number = this.currentVW() / SHARED_DESIGN.STAGE_WIDTH;
    return this.isViewportSkinnier ? stageScale : this.scaleY;
  }

  private get skinniness(): number {
    // 0 at >= 16:9, up to 1 as view scales skinnier
    return Math.max(0, Math.min(1, 1 - this.scaleX / this.scaleY));
  }

  // Weighted notch scaling: tend toward scaleX on skinny screens
  private get notchScale(): number {
    const scaleWeight: number = 0.5;
    return this.isViewportSkinnier ? this.scaleY + (this.scaleX - this.scaleY) * scaleWeight : this.scaleY;
  }

  // Determine best layout that fits above the border
  public computeChannelGrid(): ChannelGrid {
    const maxColsPref: number = 4;
    const topOffsetPx: number = this.DESIGN_GRID_TOP_CLEARANCE * this.scaleY;
    const bottomPaddingPx: number = 16;

    const gridWidth: number = Math.max(1, this.slideWidth() - this.channelGapPx());
    const gridHeight: number = Math.max(1, this.borderStartY() - topOffsetPx - bottomPaddingPx);
    const gap: number = this.channelGapPx();
    const invertedAspect: number = 1 / this.CHANNEL_ASPECT;

    const minChannelWidth: number = 288 * this.scaleY;

    const widthCap: number = Math.floor((gridWidth + gap) / (minChannelWidth + gap));
    const cols: number = Math.max(1, Math.min(maxColsPref, widthCap));

    const totalGapW: number = (cols - 1) * gap;
    const channelWidth: number = (gridWidth - totalGapW) / cols;
    const channelHeight: number = channelWidth * invertedAspect;

    const rows: number = Math.max(cols === maxColsPref ? 3 : 2, Math.floor((gridHeight + gap) / (channelHeight + gap)));

    return {
      cols,
      rows,
      capacity: cols * rows,
      channelWidth,
      channelHeight,
    };
  }

  // Build one slide segment of the border
  private buildBorderSegment(
    segmentStartX: number,
    isShadow: boolean = false,
    isHalf: boolean = false,
    isLeftHalf: boolean = false,
  ): string {
    // X positions
    const leftEdgeX: number = segmentStartX;
    const rightEdgeX: number = segmentStartX + this.slideWidth();
    const leftStraightEndX: number = leftEdgeX + this.edgeToNotch();
    const notchLeftMidX: number = leftStraightEndX + this.notchCurveWidth() / 2;
    const notchLeftEndX: number = leftStraightEndX + this.notchCurveWidth();
    const bottomMidX: number = segmentStartX + this.slideWidth() / 2;
    const notchRightStartX: number = rightEdgeX - this.edgeToNotch() - this.notchCurveWidth();
    const notchRightMidX: number = rightEdgeX - this.edgeToNotch() - this.notchCurveWidth() / 2;
    const notchRightEndX: number = rightEdgeX - this.edgeToNotch();

    // Y positions
    const yTop: number = isShadow ? this.borderStartY() + this.borderShadowInsideExcess() : this.borderStartY();
    const yMid: number = yTop + this.notchDepth() / 2;
    const yBottom: number = yTop + this.notchDepth();

    // Arc radii
    const rx: number = this.arcRx();
    const ry: number = this.arcRy();

    if (!isHalf) {
      return `
        L ${leftStraightEndX} ${yTop}
        A ${rx} ${ry} 0 0 1 ${notchLeftMidX} ${yMid}
        A ${rx} ${ry} 0 0 0 ${notchLeftEndX} ${yBottom}
        L ${bottomMidX} ${yBottom}
        L ${notchRightStartX} ${yBottom}
        A ${rx} ${ry} 0 0 0 ${notchRightMidX} ${yMid}
        A ${rx} ${ry} 0 0 1 ${notchRightEndX} ${yTop}
        L ${rightEdgeX} ${yTop}
      `;
    } else {
      if (isLeftHalf) {
        return `
          L ${leftStraightEndX} ${yTop}
          A ${rx} ${ry} 0 0 1 ${notchLeftMidX} ${yMid}
          A ${rx} ${ry} 0 0 0 ${notchLeftEndX} ${yBottom}
          L ${bottomMidX} ${yBottom}
        `;
      } else {
        return `
          L ${notchRightStartX - bottomMidX} ${yBottom}
          A ${rx} ${ry} 0 0 0 ${notchRightMidX - bottomMidX} ${yMid}
          A ${rx} ${ry} 0 0 1 ${notchRightEndX - bottomMidX} ${yTop}
          L ${rightEdgeX - bottomMidX} ${yTop}
        `;
      }
    }
  }

  private computeDisplay(): void {
    // Scaled geometry
    this.slideHeight.set(this.DESIGN_SLIDE_HEIGHT * this.scaleY);
    this.slideWidth.set(this.DESIGN_SLIDE_WIDTH * this.scaleX);
    this.notchDepth.set(this.DESIGN_NOTCH_DEPTH * this.notchScale);
    this.edgeToNotch.set(this.DESIGN_EDGE_TO_NOTCH * this.scaleX);
    this.notchCurveWidth.set(this.DESIGN_NOTCH_CURVE_W * this.scaleX);
    this.arcRx.set(this.DESIGN_ARC_R * this.scaleX);
    this.arcRy.set(this.DESIGN_ARC_R * this.notchScale);
    this.borderShadowInsideExcess.set(this.DESIGN_BORDER_SHADOW_INSIDE * this.scaleY);
    this.underShadowInsideExcess.set(this.DESIGN_UNDER_SHADOW_INSIDE * this.scaleY);

    // Border Y (tend lower on skinny screens)
    const defaultY: number = this.DESIGN_BORDER_START_Y * this.scaleY;
    if (this.isViewportSkinnier) {
      document.documentElement.style.setProperty('--bodyBackground', this.cssVar('--bodyGradient'));
      const shiftBelow: number = this.slideHeight() - defaultY;
      const weight: number = 0.5;
      this.borderStartY.set(defaultY + shiftBelow * this.skinniness * weight);
    } else {
      document.documentElement.style.setProperty('--bodyBackground', 'black');
      this.borderStartY.set(defaultY);
    }

    // Channel Grid
    this.channelGrid.set(this.computeChannelGrid());

    const { rows, channelHeight } = this.channelGrid();
    const gap: number = this.channelGapPx();
    const gridHeight: number = rows * channelHeight + (rows - 1) * gap;
    const scaledBottomClearance: number = this.DESIGN_GRID_BOTTOM_CLEARANCE * this.scaleY;

    const designTop: number = this.borderStartY() - scaledBottomClearance - gridHeight;
    const centerTop: number = designTop / 2;

    const centerWeightedTop: number = designTop + (centerTop - designTop) * this.GRID_CENTERING_WEIGHT;

    this.channelGridTopPx.set(
      Math.round(
        this.isViewportSkinnier ? centerWeightedTop + (centerTop - centerWeightedTop) * this.skinniness : designTop,
      ),
    );

    // Clock
    const clockAnchorY: number = this.borderStartY() + this.notchDepth() * this.CLOCK_ANCHOR_TOP;

    this.clockScaleFactor.set(
      1 + (this.notchScale / this.scaleY - 1) * (this.isViewportSkinnier ? this.skinniness : 0),
    );

    const targetFontPx: number = this.DESIGN_CLOCK_FONT * this.scaleY * this.clockScaleFactor();
    const clockTopStage: number = clockAnchorY - targetFontPx * 0.55 + this.CLOCK_TOP_NUDGE * this.scaleY;
    const notchClockTop: number = clockTopStage - this.channelGridTopPx();

    this.clockTopPx.set(
      Math.round(
        notchClockTop +
          this.DESIGN_CLOCK_OFFSET_PX * this.scaleY * (1 - (this.isViewportSkinnier ? this.skinniness : 0)),
      ),
    );

    this.slideDeckHeight.set(this.slideHeight());
    this.slideDeckWidth.set(this.slideWidth() * this.slideCount());
    this.shadowOutsideExcess.set(this.slideWidth() / 5);

    // Border paths
    let borderPath: string = `M 0 ${this.borderStartY() + this.notchDepth()}`;

    borderPath += ` ${this.buildBorderSegment(0, false, true, false)}`;
    borderPath += ` ${this.buildBorderSegment(0.5 * this.slideWidth())}`;
    borderPath += ` ${this.buildBorderSegment(1.5 * this.slideWidth())}`;
    borderPath += ` ${this.buildBorderSegment(2.5 * this.slideWidth())}`;
    borderPath += ` ${this.buildBorderSegment(3.5 * this.slideWidth(), false, true, true)}`;

    this.blueBorderLinePath.set(borderPath);

    this.aboveLineClipPath.set(`
      M 0 0
      ${borderPath.replace(/^M /, 'L ')}
      L ${this.slideDeckSvgWidth()} 0
      Z
    `);

    this.belowLineClipPath.set(`
      M 0 ${this.slideDeckHeight()}
      ${borderPath.replace(/^M /, 'L ')}
      L ${this.slideDeckSvgWidth()} ${this.slideDeckHeight()}
      Z
    `);

    this.bottomDeckClipPath.set(`
      M 0 ${this.slideDeckHeight()}
      L 0 ${this.borderStartY()}
      L ${this.currentVW()} ${this.borderStartY()}
      L ${this.currentVW()} ${this.slideDeckHeight()}
      Z
    `);

    // Shadow paths
    let innerPath: string = `M 0 ${this.borderStartY() + this.notchDepth() + this.borderShadowInsideExcess()}`;

    innerPath += ` ${this.buildBorderSegment(0, true, true, false)}`;
    innerPath += ` ${this.buildBorderSegment(0.5 * this.slideWidth(), true)}`;
    innerPath += ` ${this.buildBorderSegment(1.5 * this.slideWidth(), true)}`;
    innerPath += ` ${this.buildBorderSegment(2.5 * this.slideWidth(), true)}`;
    innerPath += ` ${this.buildBorderSegment(3.5 * this.slideWidth(), true, true, true)}`;

    this.borderShadowPath.set(`
      M ${this.slideDeckSvgWidth() + this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.borderStartY() + this.borderShadowInsideExcess()}
      ${innerPath.replace(/^M /, 'L ')}
      L ${this.slideDeckSvgWidth() + this.shadowOutsideExcess()} ${this.borderStartY() + this.borderShadowInsideExcess()}
      L ${this.slideDeckSvgWidth() + this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
    `);

    this.lowerShadowPath.set(`
      M ${this.currentVW() + this.shadowOutsideExcess()} ${this.slideDeckHeight() + this.shadowOutsideExcess()}
      L ${this.currentVW() + this.shadowOutsideExcess()} ${this.slideDeckHeight() - this.underShadowInsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.slideDeckHeight() - this.underShadowInsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.slideDeckHeight() + this.shadowOutsideExcess()}
      Z
    `);
  }

  private computeDesignClockOffsetPx(): number {
    const gap: number = this.DESIGN_CHANNEL_GAP;
    const cols: number = 4;
    const rows: number = 3;

    const gridWidth: number = this.DESIGN_SLIDE_WIDTH - gap;
    const channelWidth: number = (gridWidth - (cols - 1) * gap) / cols;
    const channelHeight: number = channelWidth * (1 / this.CHANNEL_ASPECT);
    const gridHeight: number = rows * channelHeight + (rows - 1) * gap;

    const bottomBound: number = this.DESIGN_BORDER_START_Y - this.DESIGN_GRID_BOTTOM_CLEARANCE;
    const gridTop: number = Math.max(this.DESIGN_GRID_TOP_CLEARANCE, bottomBound - gridHeight);

    const designClockTop: number = gridHeight + this.DESIGN_CLOCK_SPACING_FROM_GRID_PX + gridHeight * 0.01;

    const clockAnchorY: number = this.DESIGN_BORDER_START_Y + this.DESIGN_NOTCH_DEPTH * this.CLOCK_ANCHOR_TOP;
    const targetFontPx: number = this.DESIGN_CLOCK_FONT;
    const clockTopStage: number = clockAnchorY - targetFontPx * 0.55 + this.CLOCK_TOP_NUDGE;
    const notchClockTop: number = clockTopStage - gridTop;

    return designClockTop - notchClockTop;
  }
}
