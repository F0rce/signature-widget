/**
@license MIT
Copyright 2021-2023 David "F0rce" Dodlek
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { LitElement, html, css } from "lit";

import SignaturePad from "signature_pad";
class LitSignaturePad extends LitElement {
  static get properties() {
    return {
      dotSize: { type: Number },
      minWidth: { type: Number },
      maxWidth: { type: Number },
      throttle: { type: Number },
      minDistance: { type: Number },
      backgroundColor: { type: String },
      penColor: { type: String },
      velocityFilterWeight: { type: Number },
      type: { type: String },
      encoderOptions: { type: Number },
      readOnly: { type: Boolean },
      img: { type: String },
      clearButtonVisible: { type: Boolean },
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
    this.clearButtonVisible = true;
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
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      #clearButton {
        display: none;
        z-index: 9;
        position: absolute;
        width: 1em;
        height: 1em;
        line-height: 1;
        top: 0.25em;
        right: 0.25em;
        font-size: var(--lumo-icon-size-m);
        text-align: center;
        color: var(--lumo-contrast-60pct);
        transition: 0.2s color;
        cursor: var(--lumo-clickable-cursor);
      }
      #clearButton.visible {
        display: block;
        cursor: var(--lumo-clickable-cursor);
      }
      #clearButton::before {
        content: var(--lumo-icons-cross);
        font-family: "lumo-icons";
        display: block;
      }
      #clearButton:hover {
        color: var(--lumo-contrast-90pct);
      }
      #clearButton.disabled {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      <div
        id="signatureWrapper"
        style="height: 100%; width: 100%; position: relative; -moz-user-select: none; -webkit-user-select: none; -mz-user-select: none; user-select: none;"
      >
        <canvas id="signature"></canvas>
        <div id="clearButton" @click="${this.onClearButton}"></div>
      </div>
    `;
  }

  firstUpdated() {
    this.signatureCanvas = this.shadowRoot.getElementById("signature");
    this.clearButton = this.shadowRoot.getElementById("clearButton");

    let self = this;
    this.observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        self.resizeSignature();
      });
    });

    let intersectionObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          self.resizeSignature();
        }
      });
    });

    intersectionObserver.observe(this.signatureCanvas);

    this.initSignaturePad();
  }

  updated(changedProperties) {
    for (let i = 0; i < changedProperties.size; i++) {
      var toUpdate = Array.from(changedProperties.keys())[i];
      if (toUpdate == "type" || toUpdate == "encoderOptions") {
        this.onEncodingChanged();
        return;
      }

      var funcToCall = toUpdate + "Changed";
      if (typeof this[funcToCall] == "function") {
        this[funcToCall](); // This line is freaking cool
      }
    }
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
    });

    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signatureCanvas.width = this.signatureCanvas.offsetWidth * ratio;
    this.signatureCanvas.height = this.signatureCanvas.offsetHeight * ratio;
    this.signatureCanvas.getContext("2d").scale(ratio, ratio);

    this.signaturePad.addEventListener("beginStroke", () => {
      this.clearButton.classList.add("visible");
    });

    this.signaturePad.addEventListener("endStroke", () => {
      this.encodeImage();
    });

    this.signaturePad.clear();
  }

  clear() {
    if (!this.signaturePad) return;
    this.signaturePad.clear();
    this.clearButton.classList.remove("visible");
    this.encodeImage();
  }

  undo() {
    if (!this.signaturePad) return;
    var data = this.signaturePad.toData();
    if (data.length !== 0) {
      data.pop();
      this.signaturePad.fromData(data);
      this.encodeImage();
    }
    if (data.length === 0) {
      this.clearButton.classList.remove("visible");
    }
  }

  encodeImage() {
    if (!this.signaturePad) return;

    var uri = this.signaturePad.toDataURL(this.type, this.encodingOptions);
    this.dispatchEvent(
      new CustomEvent("image-encode", {
        detail: {
          image: uri,
          type: this.type,
          isEmpty: this.signaturePad.isEmpty(),
        },
      })
    );
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
    if (this.readOnly) {
      this.signaturePad.off();
      this.clearButton.classList.add("disabled");
    } else {
      this.signaturePad.on();
      this.clearButton.classList.remove("disabled");
    }
  }

  imgChanged() {
    if (!this.signaturePad) return;
    this.signaturePad.fromDataURL(this.img);
    this.encodeImage();
  }

  onEncodingChanged() {
    if (!this.signaturePad) return;
    this.encodeImage();
  }

  clearButtonVisibleChanged() {
    if (!this.signaturePad) return;
    if (this.clearButtonVisible) {
      this.clearButton.classList.remove("disabled");
    } else {
      this.clearButton.classList.add("disabled");
    }
  }

  resizeSignature() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signatureCanvas.width = this.signatureCanvas.offsetWidth * ratio;
    this.signatureCanvas.height = this.signatureCanvas.offsetHeight * ratio;
    this.signatureCanvas.getContext("2d").scale(ratio, ratio);
    this.signaturePad.fromData(this.signaturePad.toData());
  }

  onClearButton() {
    this.clear();
  }
}

customElements.define("lit-signature-pad", LitSignaturePad);
