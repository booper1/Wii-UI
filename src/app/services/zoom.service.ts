import { TemplatePortal } from '@angular/cdk/portal';
import { computed, effect, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { gsap } from 'gsap';
import { SHARED_DESIGN } from '../constants/shared-design.data';
import { TIMING } from '../constants/timing-variables';
import { DisplayService } from './display.service';

interface ChannelRegistration {
  portal: TemplatePortal;
  wrapperElement: HTMLElement;
}

interface TransformValues {
  scale: number;
  x: number;
  y: number;
}

type ZoomState = 'zoomedOut' | 'zoomingIn' | 'zoomedIn' | 'zoomingOut';

@Injectable({ providedIn: 'root' })
export class ZoomService {
  protected displayService: DisplayService = inject(DisplayService);

  public readonly zoomState: WritableSignal<ZoomState> = signal('zoomedOut');

  public readonly isZoomActive: Signal<boolean> = computed(() => this.zoomState() !== 'zoomedOut');

  public readonly activePortal: WritableSignal<TemplatePortal | null> = signal(null);
  public readonly activeChannelId: WritableSignal<string | null> = signal(null);
  public readonly activeChannelRect: WritableSignal<DOMRect | null> = signal(null);

  private readonly channelOriginRegistry = new Map<string, ChannelRegistration>();

  // Used to instantly transfer zoom styles when changing zoomed channels
  public channelBgCachedAttributes: Record<string, string> | null = null;
  public channelFgCachedAttributes: Record<string, string> | null = null;

  public transformValues: TransformValues = { scale: 1, x: 0, y: 0 };

  constructor() {
    effect(() => {
      const rect: DOMRect | null = this.activeChannelRect();
      const stage: DOMRect = document.getElementById('stage')!.getBoundingClientRect();

      if (!rect) {
        this.transformValues = { scale: 1, x: 0, y: 0 };
      } else {
        const scaleX: number = stage.width / rect.width;
        const scaleY: number = stage.height / rect.height;
        const scale: number = Math.min(scaleX, scaleY);

        const channelCenterX: number = rect.left + rect.width / 2;
        const stageCenterX: number = stage.left + stage.width / 2;
        const x: number = stageCenterX - channelCenterX;

        const channelCenterY: number = rect.top + rect.height / 2;
        const stageCenterY: number = stage.top + stage.height / 2;
        const y: number = stageCenterY - channelCenterY;

        this.transformValues = { scale, x, y };
      }
    });
  }

  public registerChannelOrigin(channelId: string, portal: TemplatePortal, wrapperElement: HTMLElement): void {
    this.channelOriginRegistry.set(channelId, { portal, wrapperElement });
  }

  public zoomIn(channelId: string): void {
    if (this.zoomState() === 'zoomedOut') {
      this.setActiveChannel(channelId);

      // Give the activePortal time to update and pull in the activeChannelRect
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Get necessary zoom-related elements
          const stageElement = document.getElementById('stage')!;
          const bgGroupElement = document.querySelector('#zoom-overlay g.channelContent.bg');
          const fgGroupElement = document.querySelector('#zoom-overlay g.channelContent.fg');

          if (bgGroupElement && fgGroupElement) {
            // Prepare for zoom in
            gsap.set(document.documentElement, {
              '--slideTransitionDurationMs': '0ms',
            });

            gsap.set([bgGroupElement, fgGroupElement], {
              scale: this.getInvertedTransformValue(this.transformValues.scale, 'scale'),
              x: this.getInvertedTransformValue(this.transformValues.x, 'x'),
              y: this.getInvertedTransformValue(this.transformValues.y, 'y'),
              transformOrigin: 'center',
              opacity: 1,
              visibility: 'visible',
            });

            // Zoom in
            this.zoomState.set('zoomingIn');

            const timeline = gsap.timeline({
              defaults: {
                duration: TIMING.ZOOM_TRANSITION_DURATION / 1000,
                delay: (TIMING.ARROW_SLIDE_IN_DURATION * 2) / 1000,
                ease: 'power1.in',
                transformOrigin: 'center',
              },
              onComplete: () => {
                this.zoomState.set('zoomedIn');
                gsap.set(stageElement, { scaleX: 1, scaleY: 1, x: 0, y: 0, transformOrigin: 'center' });
                gsap.set(document.documentElement, {
                  '--zoomTransitionDurationMs': 'unset',
                });
              },
            });

            const vh: number = Math.round(window.visualViewport?.height ?? window.innerHeight);
            const vw: number = Math.round(window.visualViewport?.width ?? window.innerWidth);
            const isSkinny = vw / vh < SHARED_DESIGN.ASPECT_RATIO;

            timeline
              .to(bgGroupElement, { scaleX: 1, scaleY: isSkinny ? 20 / 11 / (vw / vh) : 1, x: 0, y: 0 }, 0)
              .to(
                fgGroupElement,
                {
                  scale: 1,
                  x: 0,
                  y: this.getInvertedTransformValue(
                    ((stageElement.getBoundingClientRect().height *
                      (50 - parseFloat(this.displayService.cssVar('--arrowsPercentFromTop')))) /
                      100) *
                      (1 - SHARED_DESIGN.BOTTOM_SHELF_HEIGHT / SHARED_DESIGN.STAGE_HEIGHT),
                    'position',
                  ),
                },
                0,
              )
              .to(
                stageElement,
                {
                  scale: this.transformValues.scale,
                  x: this.transformValues.x * this.transformValues.scale,
                  y: this.transformValues.y * this.transformValues.scale,
                },
                0,
              );
          }
        });
      });
    }
  }

  public zoomOut(): void {
    if (this.zoomState() === 'zoomedIn') {
      // Get necessary zoom-related elements
      const stageElement = document.getElementById('stage')!;
      const bgGroupElement = document.querySelector('#zoom-overlay g.channelContent.bg');
      const fgGroupElement = document.querySelector('#zoom-overlay g.channelContent.fg');

      if (bgGroupElement && fgGroupElement) {
        // Prepare for zoom out
        gsap.set(document.documentElement, {
          '--zoomTransitionDurationMs': `${TIMING.ZOOM_TRANSITION_DURATION}ms`,
        });

        gsap.set([bgGroupElement, fgGroupElement], { opacity: 1, visibility: 'visible' });

        gsap.set(stageElement, {
          scale: this.transformValues.scale,
          x: this.transformValues.x * this.transformValues.scale,
          y: this.transformValues.y * this.transformValues.scale,
          transformOrigin: 'center',
        });

        // Zoom out
        this.zoomState.set('zoomingOut');

        const timeline = gsap.timeline({
          defaults: {
            duration: TIMING.ZOOM_TRANSITION_DURATION / 1000,
            ease: 'power1.out',
          },
          onComplete: () => {
            this.zoomState.set('zoomedOut');
            this.activePortal.set(null);
            this.activeChannelId.set(null);
            this.activeChannelRect.set(null);

            requestAnimationFrame(() => {
              gsap.set(document.documentElement, {
                '--slideTransitionDurationMs': `${TIMING.SLIDE_TRANSITION_DURATION}ms`,
              });
            });
          },
        });

        timeline
          .to(
            [bgGroupElement, fgGroupElement],
            {
              scale: this.getInvertedTransformValue(this.transformValues.scale, 'scale'),
              x: this.getInvertedTransformValue(this.transformValues.x, 'x'),
              y: this.getInvertedTransformValue(this.transformValues.y, 'y'),
              transformOrigin: 'center',
            },
            0,
          )
          .to(
            stageElement,
            {
              scale: 1,
              x: 0,
              y: 0,
              transformOrigin: 'center',
            },
            0,
          );
      }
    }
  }

  public toggleChannelZoom(channelId: string): void {
    if (this.zoomState() === 'zoomedOut') {
      this.zoomIn(channelId);
    } else if (this.zoomState() === 'zoomedIn') {
      this.zoomOut();
    }
  }

  public setActiveChannel(channelId: string): void {
    const channelOrigin = this.channelOriginRegistry.get(channelId);

    if (channelOrigin) {
      const bgGroupElement = document.querySelector('#zoom-overlay g.channelContent.bg');
      const fgGroupElement = document.querySelector('#zoom-overlay g.channelContent.fg');

      if (bgGroupElement && fgGroupElement) {
        this.channelBgCachedAttributes = this.cacheAttributes(bgGroupElement);
        this.channelFgCachedAttributes = this.cacheAttributes(fgGroupElement);
      }

      // Update active value signals
      this.activePortal.set(channelOrigin.portal);
      this.activeChannelId.set(channelId);
      this.activeChannelRect.set(channelOrigin.wrapperElement.getBoundingClientRect());
    }
  }

  public onZoomResize(channelId: string, retryCount: number = 0): void {
    const channelOrigin = this.channelOriginRegistry.get(channelId);

    if (channelOrigin && retryCount < 5) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const rect = channelOrigin.wrapperElement.getBoundingClientRect();
          if (rect.x !== 0 && rect.y !== 0 && rect.width !== 0 && rect.height !== 0) {
            this.activeChannelRect.set(rect);

            this.updateChannelPositioning();
          } else {
            this.onZoomResize(channelId, ++retryCount);
          }
        });
      });
    }
  }

  // Transform Helper
  private getInvertedTransformValue(baseValue: number, type: keyof TransformValues | 'position'): number {
    switch (type) {
      case 'scale':
        return 1 / baseValue;
      case 'x':
      case 'y':
      case 'position':
        return (-baseValue * 1000) / Math.min(window.innerWidth, (window.innerHeight * 16) / 9);
      default:
        return -1;
    }
  }

  private updateChannelPositioning(): void {
    // Update the positioning of the zoomed channel
    // Get necessary zoom-related elements
    const stageElement = document.getElementById('stage')!;
    const bgGroupElement = document.querySelector('#zoom-overlay g.channelContent.bg');
    const fgGroupElement = document.querySelector('#zoom-overlay g.channelContent.fg');

    if (bgGroupElement && fgGroupElement) {
      const vh: number = Math.round(window.visualViewport?.height ?? window.innerHeight);
      const vw: number = Math.round(window.visualViewport?.width ?? window.innerWidth);
      const isSkinny = vw / vh < SHARED_DESIGN.ASPECT_RATIO;

      gsap.set(bgGroupElement, {
        scaleX: 1,
        scaleY: isSkinny ? 20 / 11 / (vw / vh) : 1,
        x: 0,
        y: 0,
        transformOrigin: 'center',
        immediateRender: true,
      });

      gsap.set(fgGroupElement, {
        scale: 1,
        x: 0,
        y: this.getInvertedTransformValue(
          ((stageElement.getBoundingClientRect().height *
            (50 - parseFloat(this.displayService.cssVar('--arrowsPercentFromTop')))) /
            100) *
            (1 - SHARED_DESIGN.BOTTOM_SHELF_HEIGHT / SHARED_DESIGN.STAGE_HEIGHT),
          'position',
        ),
        transformOrigin: 'center',
        immediateRender: true,
      });
    }
  }

  private cacheAttributes(el: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  public restoreAttributes(el: Element, attrs: Record<string, string>): void {
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, value);
    }
  }

  public clearCachedAttributes() {
    this.channelBgCachedAttributes = null;
    this.channelFgCachedAttributes = null;
  }
}
