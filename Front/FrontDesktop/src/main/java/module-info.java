module front.frontdesktop {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires net.synedra.validatorfx;

    opens front.frontdesktop to javafx.fxml;
    exports front.frontdesktop;
}