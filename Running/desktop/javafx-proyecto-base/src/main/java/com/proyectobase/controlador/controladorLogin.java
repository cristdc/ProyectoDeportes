package com.proyectobase.controlador;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;

/**
 *
 * @author Santiago
 */
    
public class controladorLogin implements Initializable{
    
    @FXML
    private Button btnIniciarSesion;

    @FXML
    private PasswordField txtPassword;

    @FXML
    private TextField txtUsuario;

    @FXML
    void btnAccionIniciarSesion(ActionEvent event) {

    }

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        
    }
    
}
