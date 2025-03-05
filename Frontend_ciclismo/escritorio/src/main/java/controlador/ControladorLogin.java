
package controlador;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.Pane;

public class ControladorLogin implements Initializable{

    @FXML
    private Button btnIngresarLogin;

    @FXML
    private Label lblErrorLogin;

    @FXML
    private Label lblLogin;

    @FXML
    private Label lblLogin1;

    @FXML
    private Pane loginPane;

    @FXML
    private TextField txtContrasenaLogin;

    @FXML
    private TextField txtCorreoLogin;

    @FXML
    void accederVista(ActionEvent event) {

    }
    @Override
    public void initialize(URL url, ResourceBundle rb) {
        
    }
    
}
