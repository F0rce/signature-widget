package de.f0rce.signaturepad;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import com.vaadin.flow.component.ComponentEvent;

/** @author David "F0rce" Dodlek */
public class ValueChangedEvent extends ComponentEvent<SignaturePad> {

  /** */
  private static final long serialVersionUID = 1280906391516162475L;

  private String image;
  private String type;
  private boolean isEmpty;

  public ValueChangedEvent(
      SignaturePad source, boolean fromClient, String image, String type, boolean isEmpty) {
    super(source, fromClient);
    this.image = image;
    this.type = type;
    this.isEmpty = isEmpty;
  }

  /**
   * Returns the dataUrl of the encoded image.
   *
   * @return {@link String}
   */
  public String getImage() {
    return this.image;
  }

  /**
   * Returns the dataurl of the encoded image as Base64 decoded byte array.
   *
   * @return byte[]
   */
  public byte[] getImageBase64() {
    if (this.image.equals("") || this.isEmpty) {
      return null;
    }
    String split = this.image.split(",")[1];
    return Base64.getDecoder().decode(split.getBytes(StandardCharsets.UTF_8));
  }

  /**
   * Returns the type, the image has been encoded with.
   *
   * @return {@link String}
   */
  public String getType() {
    return this.type;
  }

  /**
   * Returns if the signature is empty.
   *
   * @return boolean
   */
  public boolean isEmpty() {
    return this.isEmpty;
  }
}
