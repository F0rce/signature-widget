package de.f0rce.signaturepad;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

/** @author David "F0rce" Dodlek */
@Tag("lit-signature-pad")
@JsModule("./@f0rce/signature-widget.js")
@NpmPackage(value = "signature_pad", version = "4.0.4")
public class SignaturePad extends Component implements HasSize {

  private double dotSize;
  private double lineMinWidth = 0.5;
  private double lineMaxWidth = 2.5;
  private int throttle = 16;
  private int minDistance = 5;
  private String backgroundColor = "#ffffff";
  private String penColor = "#000000";
  private double velocityFilterWeight = 0.7;
  private String imageUri = "";
  private String type = "image/png";
  private boolean readOnly = false;
  private double encoderQuality = 0.85;
  private boolean isEmpty = true;

  /** Default constructor. By default height is set to 100px and width to 300px. */
  public SignaturePad() {
    super.addListener(ImageEncode.class, this::updateImage);
    this.setHeight("100px");
    this.setWidth("300px");
  }

  // Used to sync the private variables (called after the frontend event has been
  // fired)
  private void updateImage(ImageEncode event) {
    this.imageUri = event.getImage();
    this.type = event.getType();
    this.isEmpty = event.isEmpty();
  }

  /** Clears the widget. */
  public void clear() {
    this.getElement().callJsFunction("clear");
  }

  /**
   * Sets the radius of a single dot.
   *
   * @param dotSize int
   */
  public void setDotSize(int dotSize) {
    double dotSizeD = Double.valueOf(dotSize);
    this.getElement().setProperty("dotSize", dotSizeD);
    this.dotSize = dotSizeD;
  }

  /**
   * Sets the radius of a single dot.
   *
   * @param dotSize double
   */
  public void setDotSize(double dotSize) {
    this.getElement().setProperty("dotSize", dotSize);
    this.dotSize = dotSize;
  }

  /**
   * Returns the current set radius of a single dot.
   *
   * @return double
   */
  public double getDotSize() {
    return this.dotSize;
  }

  /**
   * Sets the minimum width of a line. Defaults to 0.5.
   *
   * @param lineMinWidth int
   */
  public void setLineMinWidth(int lineMinWidth) {
    double lineMinWidthD = Double.valueOf(lineMinWidth);
    this.getElement().setProperty("minWidth", lineMinWidthD);
    this.lineMinWidth = lineMinWidthD;
  }

  /**
   * Sets the minimum width of a line. Defaults to 0.5.
   *
   * @param lineMinWidth double
   */
  public void setLineMinWidth(double lineMinWidth) {
    this.getElement().setProperty("minWidth", lineMinWidth);
    this.lineMinWidth = lineMinWidth;
  }

  /**
   * Returns the current set minimum width of a line.
   *
   * @return double
   */
  public double getLineMinWidth() {
    return this.lineMinWidth;
  }

  /**
   * Sets the maximum width of a line. Defaults to 2.5.
   *
   * @param lineMaxWidth int
   */
  public void setLineMaxWidth(int lineMaxWidth) {
    double lineMaxWidthD = Double.valueOf(lineMaxWidth);
    this.getElement().setProperty("maxWidth", lineMaxWidthD);
    this.lineMaxWidth = lineMaxWidthD;
  }

  /**
   * Sets the maximum width of a line. Defaults to 2.5.
   *
   * @param lineMaxWidth double
   */
  public void setLineMaxWidth(double lineMaxWidth) {
    this.getElement().setProperty("maxWidth", lineMaxWidth);
    this.lineMaxWidth = lineMaxWidth;
  }

  /**
   * Returns the current set maximum width of a line.
   *
   * @return double
   */
  public double getLineMaxWidth() {
    return this.lineMaxWidth;
  }

  /**
   * Sets the throttle, which will draw the next point at most once per every x milliseconds. Set it
   * to 0 to turn off throttling. Defaults to 16.
   *
   * @param throttle int
   */
  public void setThrottle(int throttle) {
    this.getElement().setProperty("throttle", throttle);
    this.throttle = throttle;
  }

  /**
   * Returns the current set throttle.
   *
   * @return int
   */
  public int getThrottle() {
    return this.throttle;
  }

  /**
   * Sets the minDistance, which adds the next point only if the previous one is farther than x
   * pixels. Defaults to 5.
   *
   * @param minDistance int
   */
  public void setMinDistance(int minDistance) {
    this.getElement().setProperty("minDistance", minDistance);
    this.minDistance = minDistance;
  }

  /**
   * Returns the current set min distance.
   *
   * @return int
   */
  public int getMinDistance() {
    return this.minDistance;
  }

  /**
   * Sets the background color in RGB format.
   *
   * @param red int
   * @param green int
   * @param blue int
   */
  public void setBackgroundColor(int red, int green, int blue) {
    String rgb = "rgb(" + red + ", " + green + ", " + blue + ")";
    this.getElement().setProperty("backgroundColor", rgb);
    this.backgroundColor = rgb;
  }

  /**
   * Sets the background color in RGBA format.
   *
   * @param red int
   * @param green int
   * @param blue int
   * @param alpha int
   */
  public void setBackgroundColor(int red, int green, int blue, int alpha) {
    String rgba = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
    this.getElement().setProperty("backgroundColor", rgba);
    this.backgroundColor = rgba;
  }

  /**
   * Sets the background color in hex format.
   *
   * @param hex {@link String}
   */
  public void setBackgroundColor(String hex) {
    this.getElement().setProperty("backgroundColor", hex);
    this.backgroundColor = hex;
  }

  /**
   * Returns the current set background color.
   *
   * @return {@link String}
   */
  public String getBackgroundColor() {
    return this.backgroundColor;
  }

  /**
   * Sets the pen color in RGB format.
   *
   * @param red int
   * @param green int
   * @param blue int
   */
  public void setPenColor(int red, int green, int blue) {
    String rgb = "rgb(" + red + ", " + green + ", " + blue + ")";
    this.getElement().setProperty("penColor", rgb);
    this.penColor = rgb;
  }

  /**
   * Sets the pen color in hex format.
   *
   * @param hex {@link String}
   */
  public void setPenColor(String hex) {
    this.getElement().setProperty("penColor", hex);
    this.penColor = hex;
  }

  /**
   * Returns the current set pen color.
   *
   * @return {@link String}
   */
  public String getPenColor() {
    return this.penColor;
  }

  /**
   * Sets the velocityFilterWeight, which is used to modify new velocity based on the previous
   * velocity. Defaults to 0.7
   *
   * @param velocityFilterWeight int
   */
  public void setVelocityFilterWeight(int velocityFilterWeight) {
    double velocityFilterWeightD = Double.valueOf(velocityFilterWeight);
    this.getElement().getProperty("velocityFilterWeight", velocityFilterWeightD);
    this.velocityFilterWeight = velocityFilterWeightD;
  }

  /**
   * Sets the velocityFilterWeight, which is used to modify new velocity based on the previous
   * velocity. Defaults to 0.7
   *
   * @param velocityFilterWeight double
   */
  public void setVelocityFilterWeight(double velocityFilterWeight) {
    this.getElement().getProperty("velocityFilterWeight", velocityFilterWeight);
    this.velocityFilterWeight = velocityFilterWeight;
  }

  /**
   * Returns the current set velocityFilterWeight.
   *
   * @return double
   */
  public double getVelocityFilterWeight() {
    return this.velocityFilterWeight;
  }

  /**
   * Returns the current shown image in URI format.
   *
   * @return {@link String}
   */
  public String getImageURI() {
    return this.imageUri;
  }

  /**
   * Returns the current shown image as Base64 decoded byte array.
   *
   * @return byte[]
   */
  public byte[] getImageBase64() {
    if (this.imageUri.equals("")) {
      return null;
    }
    String split = this.imageUri.split(",")[1];
    return Base64.getDecoder().decode(split.getBytes(StandardCharsets.UTF_8));
  }

  /**
   * Sets the MIME-Type for the image encoder. Has to start with "image/"!
   *
   * @param type {@link String}
   */
  public void setType(String type) {
    if (!type.contains("image/")) {
      type = "image/png";
    }
    this.getElement().setProperty("type", type);
    this.type = type;
  }

  /**
   * Returns the current set MIME-Type. Defaults to image/png.
   *
   * @return {@link String}
   */
  public String getType() {
    return this.type;
  }

  /**
   * Sets the widget read only.
   *
   * @param readOnly boolean
   */
  public void setReadOnly(boolean readOnly) {
    this.getElement().setProperty("readOnly", readOnly);
    this.readOnly = readOnly;
  }

  /**
   * Returns if the widget is set to read only.
   *
   * @return boolean
   */
  public boolean isReadOnly() {
    return this.readOnly;
  }

  /**
   * Sets the image of the widget in URI Format.
   *
   * @param uri {@link String}
   */
  public void setImage(String uri) {
    this.getElement().setProperty("img", uri);
    this.imageUri = uri;
  }

  /**
   * Sets the encoder quality. All values between 0-1 are accepted. Defaults to 0.85.
   *
   * @param encoderQuality double
   */
  public void setEncoderQuality(double encoderQuality) {
    double x = Math.abs(encoderQuality);
    if (x > 1) {
      x = 1.00;
    }
    this.getElement().setProperty("encoderOptions", x);
    this.encoderQuality = x;
  }

  /**
   * Returns the current set encoder quality.
   *
   * @return double
   */
  public double getEncoderQuality() {
    return this.encoderQuality;
  }

  /** Reverts the last change you did to the canvas itself. */
  public void undo() {
    this.getElement().callJsFunction("undo");
  }

  /**
   * Returns if the widget is empty.
   *
   * @return boolean
   */
  public boolean isEmpty() {
    return this.isEmpty;
  }

  /** Sets the background color transparent. */
  public void setTransparentBackground() {
    this.getElement().setProperty("backgroundColor", "rgb(255, 255, 255)");
  }
}
