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

public class controladorCarreras implements Initializable{
    
     @FXML
    private Button btnDesapuntarse;

    @FXML 
    private Button btnParticipar;

    @FXML
    private TableColumn<Carrera, Double> columnDistancia;

    @FXML
    private TableColumn<Carrera, String> columnEstado;

    @FXML
    private TableColumn<Carrera, LocalDate> columnFecha;

    @FXML
    private TableColumn<Carrera, Integer> columnId;

    @FXML
    private TableColumn<Carrera, String> columnLocalizacion;

    @FXML
    private TableColumn<Carrera, String> columnNombre;

    @FXML
    private TableColumn<Carrera, String> columnTiempo;

    @FXML
    private TableColumn<Carrera, String> columnTour;

    @FXML
    private TableView<Carrera> tvCarreras;

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
