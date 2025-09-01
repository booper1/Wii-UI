import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { SHARED_DESIGN } from '../constants/shared-design.data';

@Injectable({ providedIn: 'root' })
export class DisplayService {
  // Design size for one slide
  private readonly DESIGN_SLIDE_WIDTH: number = 1728;
  private readonly DESIGN_SLIDE_HEIGHT: number = 1152;

  // Base geometry
  private readonly DESIGN_BORDER_START_Y: number =
    this.DESIGN_SLIDE_HEIGHT - SHARED_DESIGN.BOTTOM_SHELF_HEIGHT;
  private readonly DESIGN_NOTCH_DEPTH: number = 120;
  private readonly DESIGN_EDGE_TO_NOTCH: number = 180;
  private readonly DESIGN_NOTCH_CURVE_W: number = 360;
  private readonly DESIGN_ARC_R: number = 300; // the 'A 300 300' radius
  private readonly DESIGN_BORDER_SHADOW_INSIDE: number = 50;
  private readonly DESIGN_UNDER_SHADOW_INSIDE: number = 100;

  // Channel grid
  private readonly CHANNEL_ASPECT = 20 / 11;
  private readonly DESIGN_CHANNEL_GAP = 12;
  private readonly DESIGN_GRID_TOP_CLEARANCE = 28 * 2;
  private readonly DESIGN_GRID_BOTTOM_CLEARANCE = 28;

  // Clock
  private readonly DESIGN_CLOCK_FONT = 136;
  private readonly DESIGN_CLOCK_SPACING_FROM_GRID_PX = 24;
  private readonly CLOCK_ANCHOR_TOP = 0.48;
  private readonly CLOCK_TOP_NUDGE = -6;
  private readonly DESIGN_CLOCK_OFFSET_PX = this.computeDesignClockOffsetPx();

  // Cached values
  private readonly slideCount = signal(1);
  public readonly currentVH: WritableSignal<number> = signal(
    SHARED_DESIGN.STAGE_HEIGHT,
  );
  public readonly currentVW: WritableSignal<number> = signal(
    SHARED_DESIGN.STAGE_WIDTH,
  );

  private readonly GRID_CENTERING_WEIGHT = 2 / 3;

  // Shadows (outside excess is horizontal; scales with width)
  public readonly shadowOutsideExcess = signal(this.DESIGN_SLIDE_WIDTH / 5);

  // Scaled per-slide size
  public readonly slideWidth = signal(this.DESIGN_SLIDE_WIDTH);
  public readonly slideHeight = signal(this.DESIGN_SLIDE_HEIGHT);

  // Full slide deck size
  public readonly slideDeckWidth = signal(
    this.slideWidth() * this.slideCount(),
  );
  public readonly slideDeckHeight = signal(this.slideHeight());

  // Scaled geometry
  public readonly borderStartY = signal(this.DESIGN_BORDER_START_Y);
  public readonly notchDepth = signal(this.DESIGN_NOTCH_DEPTH); // vertical
  public readonly edgeToNotch = signal(this.DESIGN_EDGE_TO_NOTCH); // horizontal
  public readonly notchCurveWidth = signal(this.DESIGN_NOTCH_CURVE_W); // horizontal

  // Arc radii
  public readonly arcRx = signal(this.DESIGN_ARC_R);
  public readonly arcRy = signal(this.DESIGN_ARC_R);

  public readonly borderShadowInsideExcess = signal(
    this.DESIGN_BORDER_SHADOW_INSIDE,
  ); // vertical
  public readonly underShadowInsideExcess = signal(
    this.DESIGN_UNDER_SHADOW_INSIDE,
  ); // vertical

  // Paths bound in template
  public readonly aboveLineClipPath = signal<string>('');
  public readonly belowLineClipPath = signal<string>('');
  public readonly blueBorderLinePath = signal<string>('');
  public readonly borderShadowPath = signal<string>('');
  public readonly lowerShadowPath = signal<string>('');

  // current grid fit snapshot
  public readonly channelGrid = signal({
    cols: 4,
    rows: 3,
    capacity: 12,
    channelWidth: this.DESIGN_SLIDE_WIDTH / 4,
    channelHeight: this.DESIGN_SLIDE_WIDTH / 4 / this.CHANNEL_ASPECT,
  });

  public readonly channelGridTopPx = signal<number>(
    this.DESIGN_GRID_TOP_CLEARANCE,
  );

  // Clock outputs
  public readonly clockTopPx = signal<number>(0);
  public readonly clockScaleFactor = signal<number>(1);

  // numeric gap in current px (computed from scaleY)
  public readonly channelGapPx = computed(
    () => this.DESIGN_CHANNEL_GAP * this.scaleY,
  );

  constructor() {
    this.computeDisplay();
  }

  public relativePx(n: number) {
    return `calc(${n} / var(--originalHeight) * 100dvh)`;
  }

  public configureSlideDeck(slideCount: number): void {
    this.slideCount.set(slideCount);
    const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const vw = Math.round(window.visualViewport?.width ?? window.innerWidth);
    this.currentVH.set(vh);
    this.currentVW.set(vw);
    this.computeDisplay();
  }

  public updateViewport(): void {
    const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const vw = Math.round(window.visualViewport?.width ?? window.innerWidth);
    this.currentVH.set(vh);
    this.currentVW.set(vw);

    // TEMP: Uncomment to see live updates to aspect ratio
    // console.log('current aspect ratio:', vw / vh);

    this.computeDisplay();
  }

  // Check if viewport is skinnier than design aspect ratio
  private get isViewportSkinnier(): boolean {
    return this.currentVW() / this.currentVH() < SHARED_DESIGN.ASPECT_RATIO;
  }

  // Height always fills viewport
  private get scaleY(): number {
    return this.currentVH() / this.DESIGN_SLIDE_HEIGHT;
  }

  // Width only shrinks when skinnier than 16:9, otherwise match height scale
  private get scaleX(): number {
    const stageScale = this.currentVW() / SHARED_DESIGN.STAGE_WIDTH;
    return this.isViewportSkinnier ? stageScale : this.scaleY;
  }

  private get skinniness(): number {
    // 0 at >= 16:9, up to 1 as view scales skinnier
    return Math.max(0, Math.min(1, 1 - this.scaleX / this.scaleY));
  }

  // Weighted notch scaling: tend toward scaleX on skinny screens
  private get notchScale(): number {
    const scaleWeight = 0.5;
    return this.isViewportSkinnier
      ? this.scaleY + (this.scaleX - this.scaleY) * scaleWeight
      : this.scaleY;
  }

  // Determine best layout that fits above the border
  public computeChannelGrid() {
    const maxColsPref = 4;
    const topOffsetPx = this.DESIGN_GRID_TOP_CLEARANCE * this.scaleY;
    const bottomPaddingPx = 16;

    const gridWidth = Math.max(1, this.slideWidth() - this.channelGapPx());
    const gridHeight = Math.max(
      1,
      this.borderStartY() - topOffsetPx - bottomPaddingPx,
    );
    const gap = this.channelGapPx();
    const invertedAspect = 1 / this.CHANNEL_ASPECT;

    const minChannelWidth = 288 * this.scaleY;

    const widthCap = Math.floor((gridWidth + gap) / (minChannelWidth + gap));
    const cols = Math.max(1, Math.min(maxColsPref, widthCap));

    const totalGapW = (cols - 1) * gap;
    const channelWidth = (gridWidth - totalGapW) / cols;
    const channelHeight = channelWidth * invertedAspect;

    const rows = Math.max(
      cols === maxColsPref ? 3 : 2,
      Math.floor((gridHeight + gap) / (channelHeight + gap)),
    );

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
  ): string {
    // X positions
    const leftEdgeX = segmentStartX;
    const rightEdgeX = segmentStartX + this.slideWidth();
    const leftStraightEndX = leftEdgeX + this.edgeToNotch();
    const notchLeftMidX = leftStraightEndX + this.notchCurveWidth() / 2;
    const notchLeftEndX = leftStraightEndX + this.notchCurveWidth();
    const bottomMidX = segmentStartX + this.slideWidth() / 2;
    const notchRightStartX =
      rightEdgeX - this.edgeToNotch() - this.notchCurveWidth();
    const notchRightMidX =
      rightEdgeX - this.edgeToNotch() - this.notchCurveWidth() / 2;
    const notchRightEndX = rightEdgeX - this.edgeToNotch();

    // Y positions
    const yTop = isShadow
      ? this.borderStartY() + this.borderShadowInsideExcess()
      : this.borderStartY();
    const yMid = yTop + this.notchDepth() / 2;
    const yBottom = yTop + this.notchDepth();

    // Arc radii
    const rx = this.arcRx();
    const ry = this.arcRy();

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
    this.borderShadowInsideExcess.set(
      this.DESIGN_BORDER_SHADOW_INSIDE * this.scaleY,
    );
    this.underShadowInsideExcess.set(
      this.DESIGN_UNDER_SHADOW_INSIDE * this.scaleY,
    );

    // Border Y (tend lower on skinny screens)
    const defaultY = this.DESIGN_BORDER_START_Y * this.scaleY;
    if (this.isViewportSkinnier) {
      const shiftBelow = this.slideHeight() - defaultY;
      const weight = 0.5;
      this.borderStartY.set(defaultY + shiftBelow * this.skinniness * weight);
    } else {
      this.borderStartY.set(defaultY);
    }

    // Channel Grid
    this.channelGrid.set(this.computeChannelGrid());

    const { rows, channelHeight } = this.channelGrid();
    const gap = this.channelGapPx();
    const gridHeight = rows * channelHeight + (rows - 1) * gap;
    const scaledBottomClearance =
      this.DESIGN_GRID_BOTTOM_CLEARANCE * this.scaleY;

    const designTop = this.borderStartY() - scaledBottomClearance - gridHeight;
    const centerTop = designTop / 2;

    const centerWeightedTop =
      designTop + (centerTop - designTop) * this.GRID_CENTERING_WEIGHT;

    this.channelGridTopPx.set(
      Math.round(
        this.isViewportSkinnier
          ? centerWeightedTop +
              (centerTop - centerWeightedTop) * this.skinniness
          : designTop,
      ),
    );

    // Clock
    const clockAnchorY =
      this.borderStartY() + this.notchDepth() * this.CLOCK_ANCHOR_TOP;

    this.clockScaleFactor.set(
      1 +
        (this.notchScale / this.scaleY - 1) *
          (this.isViewportSkinnier ? this.skinniness : 0),
    );

    const targetFontPx =
      this.DESIGN_CLOCK_FONT * this.scaleY * this.clockScaleFactor();
    const clockTopStage =
      clockAnchorY - targetFontPx * 0.55 + this.CLOCK_TOP_NUDGE * this.scaleY;
    const notchClockTop = clockTopStage - this.channelGridTopPx();

    this.clockTopPx.set(
      Math.round(
        notchClockTop +
          this.DESIGN_CLOCK_OFFSET_PX *
            this.scaleY *
            (1 - (this.isViewportSkinnier ? this.skinniness : 0)),
      ),
    );

    this.slideDeckHeight.set(this.slideHeight());
    this.slideDeckWidth.set(this.slideWidth() * this.slideCount());
    this.shadowOutsideExcess.set(this.slideWidth() / 5);

    // Border paths
    let borderPath = `M 0 ${this.borderStartY()}`;
    for (let i = 0; i < this.slideCount(); i++) {
      borderPath += ` ${this.buildBorderSegment(i * this.slideWidth())}`;
    }
    this.blueBorderLinePath.set(borderPath);

    this.aboveLineClipPath.set(`
      M 0 0
      ${borderPath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth()} 0
      Z
    `);

    this.belowLineClipPath.set(`
      M 0 ${this.slideDeckHeight()}
      ${borderPath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth()} ${this.slideDeckHeight()}
      Z
    `);

    // Shadow paths
    let innerPath = `M 0 ${this.borderStartY() + this.borderShadowInsideExcess()}`;
    for (let i = 0; i < this.slideCount(); i++) {
      innerPath += ` ${this.buildBorderSegment(i * this.slideWidth(), true)}`;
    }

    this.borderShadowPath.set(`
      M ${this.slideDeckWidth() + this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.borderStartY() + this.borderShadowInsideExcess()}
      ${innerPath.replace(/^M /, 'L ')}
      L ${this.slideDeckWidth() + this.shadowOutsideExcess()} ${this.borderStartY() + this.borderShadowInsideExcess()}
      L ${this.slideDeckWidth() + this.shadowOutsideExcess()} ${this.borderStartY() - this.shadowOutsideExcess()}
    `);

    this.lowerShadowPath.set(`
      M ${this.slideDeckWidth() + this.shadowOutsideExcess()} ${this.slideDeckHeight() + this.shadowOutsideExcess()}
      L ${this.slideDeckWidth() + this.shadowOutsideExcess()} ${this.slideDeckHeight() - this.underShadowInsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.slideDeckHeight() - this.underShadowInsideExcess()}
      L ${-this.shadowOutsideExcess()} ${this.slideDeckHeight() + this.shadowOutsideExcess()}
      Z
    `);
  }

  private computeDesignClockOffsetPx(): number {
    // Design grid (4×3) geometry
    const gap = this.DESIGN_CHANNEL_GAP;
    const cols = 4;
    const rows = 3;

    const gridWidth = this.DESIGN_SLIDE_WIDTH - gap;
    const channelWidth = (gridWidth - (cols - 1) * gap) / cols;
    const channelHeight = channelWidth * (1 / this.CHANNEL_ASPECT);
    const gridHeight = rows * channelHeight + (rows - 1) * gap;

    const bottomBound =
      this.DESIGN_BORDER_START_Y - this.DESIGN_GRID_BOTTOM_CLEARANCE;
    const gridTop = Math.max(
      this.DESIGN_GRID_TOP_CLEARANCE,
      bottomBound - gridHeight,
    );

    const designClockTop =
      gridHeight + this.DESIGN_CLOCK_SPACING_FROM_GRID_PX + gridHeight * 0.01;

    const clockAnchorY =
      this.DESIGN_BORDER_START_Y +
      this.DESIGN_NOTCH_DEPTH * this.CLOCK_ANCHOR_TOP;
    const targetFontPx = this.DESIGN_CLOCK_FONT;
    const clockTopStage =
      clockAnchorY - targetFontPx * 0.55 + this.CLOCK_TOP_NUDGE;
    const notchClockTop = clockTopStage - gridTop;

    return designClockTop - notchClockTop;
  }
}
