package com.proyectobase.controlador;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

/**
 *
 * @author Santiago
 */
    
public class controladorLogin implements Initializable{
    
    @FXML
    private Button btnDesapuntarse;

    @FXML
    private Button btnParticipar;

    @FXML
    private TableColumn<?, ?> columnDistancia;

    @FXML
    private TableColumn<?, ?> columnEstado;

    @FXML
    private TableColumn<?, ?> columnFecha;

    @FXML
    private TableColumn<?, ?> columnId;

    @FXML
    private TableColumn<?, ?> columnLocalizacion;

    @FXML
    private TableColumn<?, ?> columnNombre;

    @FXML
    private TableColumn<?, ?> columnTiempo;

    @FXML
    private TableColumn<?, ?> columnTour;

    @FXML
    private TableView<?> tvCarreras;
    
    @FXML
    void btnAccionDesapuntarse(ActionEvent event) {

    }

    @FXML
    void btnAccionParticipar(ActionEvent event) {

    }

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        
    }
    
}
