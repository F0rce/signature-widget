package de.f0rce;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.router.Route;

import de.f0rce.signaturepad.SignaturePad;

@Route("")
public class View extends Div {

	public View() {
		SignaturePad signature = new SignaturePad();
		signature.setHeight("300px");
		signature.setWidth("300px");
		signature.setBackgroundColor("#000000");
		signature.setPenColor("#FFFFFF");

		Button button = new Button("RO T");
		Button button2 = new Button("RO F");

		Dialog dialog = new Dialog();
		dialog.setSizeFull();
		dialog.setCloseOnOutsideClick(true);
		dialog.setCloseOnEsc(true);
		dialog.setResizable(true);

		dialog.add(signature, button, button2);

		Button button3 = new Button("ÖFFE MICH :()");

		add(dialog, button3);

		button3.addClickListener(event -> {
			dialog.open();
		});

		button.addClickListener(event -> {
			signature.undo();
		});

		button2.addClickListener(event -> {
			signature.setReadOnly(false);
		});
	}
}
