package de.f0rce.signaturepad;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class View extends Div {

	public View() {
		HorizontalLayout vl = new HorizontalLayout();

		SignaturePad signature = new SignaturePad();
		signature.setHeight("100px");
		signature.setWidth("300px");

		Button button = new Button("Undo");
		Button button2 = new Button("Save");

		Dialog dialog = new Dialog();
		dialog.setSizeFull();
		dialog.setCloseOnOutsideClick(true);
		dialog.setCloseOnEsc(true);
		dialog.setResizable(true);

		Image sign = new Image();

		vl.add(signature, sign);

		dialog.add(vl, button, button2);

		Button button3 = new Button("Open Sign Dialog");

		this.add(dialog, button3);

		button3.addClickListener(event -> {
			dialog.open();
		});

		button.addClickListener(event -> {
			signature.undo();
		});

		button2.addClickListener(event -> {
			sign.setSrc(signature.getImageURI());
		});
	}
}
