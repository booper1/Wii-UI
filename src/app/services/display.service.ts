import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  public totalWidth = 1728;
  public totalHeight = 1152;

  public blueStartY = 841;
  public blueStartX = 0;
  public blueEndX = this.totalWidth;
  public notchDepth = 120;
  public edgeToNotch = 180;
  public notchCurveWidth = 360;

  public shadowOutsideExcess = 1728 / 5;
  public borderShadowInsideExcess = 50;
  public underShadowInsideExcess = 100;

  public underShadow = `
      M ${this.totalWidth + this.shadowOutsideExcess} ${this.totalHeight + this.shadowOutsideExcess}
      L ${this.totalWidth + this.shadowOutsideExcess} ${this.totalHeight - this.underShadowInsideExcess}
      L ${0 - this.shadowOutsideExcess} ${this.totalHeight - this.underShadowInsideExcess}
      L ${0 - this.shadowOutsideExcess} ${this.totalHeight + this.shadowOutsideExcess}
      Z
    `;

  public blueBorderLineConstructor = `
      ${this.blueStartX} ${this.blueStartY}
      L ${this.blueStartX + this.edgeToNotch} ${this.blueStartY}
      A 300 300 0 0 1 ${this.blueStartX + this.edgeToNotch + this.notchCurveWidth / 2} ${this.blueStartY + this.notchDepth / 2}
      A 300 300 0 0 0 ${this.blueStartX + this.edgeToNotch + this.notchCurveWidth} ${this.blueStartY + this.notchDepth}
      L ${this.blueEndX / 2} ${this.blueStartY + this.notchDepth}
      L ${this.blueEndX - this.edgeToNotch - this.notchCurveWidth} ${this.blueStartY + this.notchDepth}
      A 300 300 0 0 0 ${this.blueEndX - this.edgeToNotch - this.notchCurveWidth / 2} ${this.blueStartY + this.notchDepth / 2}
      A 300 300 0 0 1 ${this.blueEndX - this.edgeToNotch} ${this.blueStartY}
      L ${this.blueEndX} ${this.blueStartY}
    `;

  public aboveLineClip = `
      M 0 0
      L ${this.blueBorderLineConstructor}
      L ${this.blueEndX} 0
      Z
    `;

  public belowLineClip = `
      M 0 ${this.totalHeight}
      L ${this.blueBorderLineConstructor}
      L ${this.blueEndX} ${this.totalHeight}
      Z
    `;

  public blueBorderLine = `M ${this.blueBorderLineConstructor}`;

  public borderShadow = `
      M ${this.blueEndX + this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
      L ${this.blueStartX - this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
      L ${this.blueStartX - this.shadowOutsideExcess} ${this.blueStartY + this.borderShadowInsideExcess}
      L ${this.blueStartX + this.edgeToNotch} ${this.blueStartY + this.borderShadowInsideExcess}
      A 300 300 0 0 1 ${this.blueStartX + this.edgeToNotch + this.notchCurveWidth / 2} ${this.blueStartY + this.notchDepth / 2 + this.borderShadowInsideExcess}
      A 300 300 0 0 0 ${this.blueStartX + this.edgeToNotch + this.notchCurveWidth} ${this.blueStartY + this.notchDepth + this.borderShadowInsideExcess}
      L ${this.blueEndX / 2} ${this.blueStartY + this.notchDepth + this.borderShadowInsideExcess}
      L ${this.blueEndX - this.edgeToNotch - this.notchCurveWidth} ${this.blueStartY + this.notchDepth + this.borderShadowInsideExcess}
      A 300 300 0 0 0 ${this.blueEndX - this.edgeToNotch - this.notchCurveWidth / 2} ${this.blueStartY + this.notchDepth / 2 + this.borderShadowInsideExcess}
      A 300 300 0 0 1 ${this.blueEndX - this.edgeToNotch} ${this.blueStartY + this.borderShadowInsideExcess}
      L ${this.blueEndX + this.shadowOutsideExcess} ${this.blueStartY + this.borderShadowInsideExcess}
      L ${this.blueEndX + this.shadowOutsideExcess} ${this.blueStartY - this.shadowOutsideExcess}
    `;
}
