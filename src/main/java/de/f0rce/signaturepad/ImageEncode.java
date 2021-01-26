package de.f0rce.signaturepad;

import com.vaadin.flow.component.ComponentEvent;
import com.vaadin.flow.component.DomEvent;
import com.vaadin.flow.component.EventData;

/**
 * This class is used to listen to the image-encode event sent by the frontend.
 * It contains the image URI and the MIME-Type.
 * 
 * @author David "F0rce" Dodlek
 */
@DomEvent("image-encode")
public class ImageEncode extends ComponentEvent<SignaturePad> {

	private String image;
	private String type;

	public ImageEncode(SignaturePad source, boolean fromClient, @EventData("event.detail.image") String image,
			@EventData("event.detail.type") String type) {
		super(source, fromClient);
		this.image = image;
		this.type = type;
	}

	public String getImage() {
		return this.image;
	}

	public String getType() {
		return this.type;
	}

}
