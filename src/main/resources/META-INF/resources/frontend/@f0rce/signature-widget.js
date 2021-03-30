/**
@license MIT
Copyright 2021 David "F0rce" Dodlek
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { LitElement, html, css } from "lit-element";

import SignaturePad from "signature_pad";

class LitSignaturePad extends LitElement {
  static get properties() {
    return {
      dotSize: { type: String },
      minWidth: { type: Number },
      maxWidth: { type: Number },
      throttle: { type: Number },
      minDistance: { type: Number },
      backgroundColor: { type: String },
      penColor: { type: String },
      velocityFilterWeight: { type: Number },
      type: { type: String },
      encoderOptions: { type: Number },
      image: { type: String },
      empty: { type: Boolean },
      readOnly: { type: Boolean },
      img: { type: String },
    };
  }

  constructor() {
    super();
    this.minWidth = 0.5;
    this.maxWidth = 2.5;
    this.throttle = 16;
    this.minDistance = 5;
    this.backgroundColor = "#ffffff";
    this.penColor = "#000000";
    this.velocityFilterWeight = 0.7;
    this.type = "image/png";
    this.encoderOptions = 0.85;
    this.readOnly = false;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      #signature {
        border: 1px solid var(--lumo-contrast-20pct);
        border-radius: var(--lumo-border-radius-s);
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    return html` <canvas id="signature"></canvas> `;
  }

  firstUpdated() {
    this.signatureCanvas = this.shadowRoot.getElementById("signature");
    console.log(this.signatureCanvas);

    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signatureCanvas.width = this.signatureCanvas.offsetWidth * ratio;
    this.signatureCanvas.height = this.signatureCanvas.offsetHeight * ratio;
    this.signatureCanvas.getContext("2d").scale(ratio, ratio);

    let self = this;
    this.observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        self.resizeSignature();
      });
    });

    this.initSignaturePad();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type" || propName == "encoderOptions") {
        return this.onEncodingChanged();
      }
      let funcToCall = propName + "Changed";
      if (typeof this[funcToCall] == "function") {
        this[funcToCall]();
      }
    });
  }

  initSignaturePad() {
    this.signaturePad = new SignaturePad(this.signatureCanvas, {
      dotSize: this.dotSize,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      throttle: this.throttle,
      backgroundColor: this.backgroundColor,
      penColor: this.penColor,
      velocityFilterWeight: this.velocityFilterWeight,
      minDistance: this.minDistance,
      onEnd: this.onEnd.bind(this),
    });

    this.signaturePad.clear();

    if (this.image) {
      this.signaturePad.fromDataURL(this.image);
    }
  }

  clear() {
    this.signaturePad.clear();
    this.encodeImage();
  }

  undo() {
    var data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
      this.encodeImage();
    }
  }

  encodeImage() {
    this.image = this.signatureCanvas.toDataURL(
      this.type,
      this.encodingOptions
    );
    this.dispatchEvent(
      new CustomEvent("image-encode", {
        detail: {
          image: this.image,
          type: this.type,
          isEmpty: this.signaturePad.isEmpty(),
        },
      })
    );
  }

  onEnd(event) {
    this.encodeImage();
  }

  dotSizeChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.dotSize = this.dotSize;
  }

  minWidthChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.minWidth = this.minWidth;
  }

  maxWidthChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.maxWidth = this.maxWidth;
  }

  throttleChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.throttle = this.throttle;
  }

  minDistanceChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.minDistance = this.minDistance;
  }

  backgroundColorChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.backgroundColor = this.backgroundColor;
  }

  penColorChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.penColor = this.penColor;
  }

  velocityFilterWeightChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.velocityFilterWeight = this.velocityFilterWeight;
  }

  readOnlyChanged() {
    if (!this.signaturePad) return;
    if (this.readOnly === true) {
      this.signaturePad.off();
    } else {
      this.signaturePad.on();
    }
  }

  imgChanged() {
    this.signaturePad.fromDataURL(this.img);
    this.encodeImage();
  }

  onEncodingChanged() {
    if (this.signaturePad) {
      this.encodeImage();
    }
  }

  resizeSignature() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signatureCanvas.width = this.signatureCanvas.offsetWidth * ratio;
    this.signatureCanvas.height = this.signatureCanvasa.offsetHeight * ratio;
    this.signatureCanvas.getContext("2d").scale(ratio, ratio);
  }
}

customElements.define("lit-signature-pad", LitSignaturePad);
