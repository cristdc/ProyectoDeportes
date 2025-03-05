package com.proyectobase.controlador;

import java.awt.event.MouseEvent;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.image.ImageView;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class PantallaPrincipal implements Initializable {

    @FXML
    private ImageView imgLogo;

    @FXML
    private ImageView imgUsuario;

    @FXML
    private TableView<?> tableViewPuestos;
    
    @FXML
    private TableColumn<?,?> columnNombre;
    
    @FXML
    private TableColumn<?,?> columnPuesto;
    
    @FXML
    private TableColumn<?,?> columnTiempo;

    @FXML
    private Label txtParticipar;

    @FXML
    private Label txtCarreras;

    @FXML
    private Label txtCorredores;

    @FXML
    private Label txtKMRecorridos;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        
    }

}