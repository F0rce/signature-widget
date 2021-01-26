import SignaturePad from "signature_pad";

import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

class SignatureWidget extends PolymerElement {
  static get is() {
    return "signature-widget";
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #signature {
          border: 1px solid var(--lumo-contrast-20pct);
          border-radius: var(--lumo-border-radius-s);
          width: 100%;
          height: 100%;
        }
      </style>
      <canvas id="signature"></canvas>
    `;
  }

  static get properties() {
    return {
      dotSize: {
        type: String,
        observer: "_dotSizeChanged",
      },

      minWidth: {
        type: Number,
        value: 0.5,
        observer: "_minWidthChanged",
      },

      maxWidth: {
        type: Number,
        value: 2.5,
        observer: "_maxWidthChanged",
      },

      throttle: {
        type: Number,
        value: 16,
        observer: "_throttleChanged",
      },

      minDistance: {
        type: Number,
        value: 5,
        observer: "_minDistanceChanged",
      },

      backgroundColor: {
        type: String,
        value: "#ffffff",
        observer: "_backgroundColorChanged",
      },

      penColor: {
        type: String,
        value: "#000000",
        observer: "_penColorChanged",
      },

      velocityFilterWeight: {
        type: Number,
        value: 0.7,
        observer: "_velocityFilterWeightChanged",
      },

      type: {
        type: String,
        value: "image/png",
      },

      encoderOptions: {
        type: Number,
        value: 0.85,
      },

      image: {
        type: String,
        notify: true,
      },

      active: {
        type: Boolean,
        notify: true,
        readOnly: true,
      },

      empty: {
        type: Boolean,
        notify: true,
        readOnly: true,
      },

      readOnly: {
        type: Boolean,
        value: false,
        observer: "_readOnlyChanged",
      },

      img: {
        type: String,
        observer: "_imgChanged",
      },
    };
  }

  static get observers() {
    return ["_onEncodingChanged(type, encoderOptions)"];
  }

  connectedCallback() {
    super.connectedCallback();

    console.log("HELLO DID THIS")

    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.$.signature.width = this.$.signature.offsetWidth * ratio;
    this.$.signature.height = this.$.signature.offsetHeight * ratio;
    this.$.signature.getContext("2d").scale(ratio, ratio);

    this.initSignaturePad();
  }

  initSignaturePad() {
    this.signaturePad = new SignaturePad(this.$.signature, {
      dotSize: this.dotSize,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      throttle: this.throttle,
      backgroundColor: this.backgroundColor,
      penColor: this.penColor,
      velocityFilterWeight: this.velocityFilterWeight,
      onBegin: this._onBegin.bind(this),
      onEnd: this._onEnd.bind(this),
    });

    this.signaturePad.clear();

    if (this.image) {
      this.signaturePad.fromDataURL(this.image);
    }

    this._setEmpty(this.signaturePad.isEmpty());
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
    this.image = this.$.signature.toDataURL(this.type, this.encodingOptions);
    this._setEmpty(this.signaturePad.isEmpty());
    this.dispatchEvent(
      new CustomEvent("image-encode", {
        detail: {
          image: this.image,
          type: this.type,
        },
      })
    );
  }

  _onBegin(event) {
    this._setActive(true);
  }

  _onEnd(event) {
    this._setActive(false);
    this.encodeImage();
  }

  _dotSizeChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.dotSize = newValue;
  }

  _minWidthChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.minWidth = newValue;
  }

  _maxWidthChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.maxWidth = newValue;
  }

  _throttleChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.throttle = newValue;
  }

  _minDistanceChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.minDistance = newValue;
  }

  _backgroundColorChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.backgroundColor = newValue;
  }

  _penColorChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.penColor = newValue;
  }

  _velocityFilterWeightChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    this.signaturePad.velocityFilterWeight = newValue;
  }

  _readOnlyChanged(newValue, oldValue) {
    if (!this.signaturePad) return;
    if (this.readOnly === true) {
      this.signaturePad.off();
    } else {
      this.signaturePad.on();
    }
  }

  _imgChanged(newValue, oldValue) {
    this.signaturePad.fromDataURL(newValue);
    this.encodeImage();
  }

  _onEncodingChanged(type, encoderOptions) {
    if (this.signaturePad) {
      this.encodeImage();
    }
  }
}

customElements.define(SignatureWidget.is, SignatureWidget);
