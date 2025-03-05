package com.proyectobase.controlador;

import java.awt.event.MouseEvent;
import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.image.ImageView;
import javafx.stage.Modality;
import javafx.stage.Stage;
import modelo.Carrera;
import modelo.Usuario;

public class PantallaPrincipal implements Initializable {

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
    private TableColumn<Carrera, String> columnNombreCorredor;

    @FXML
    private TableColumn<Carrera, Integer> columnPuesto;

    @FXML
    private TableColumn<Carrera, Double> columnTiempo;

    @FXML
    private TableColumn<Carrera, Double> columnTiempoCorredor;

    @FXML
    private TableColumn<Carrera, ?> columnTour;

    @FXML
    private ImageView imgLogo;

    @FXML
    private ImageView imgUsuario;

    @FXML
    private TableView<Carrera> tableViewPuestos;

    @FXML
    private TableView<Carrera> tvCarreras;

    @FXML
    private Label txtCarreras;

    @FXML
    private Label txtCorredores;

    @FXML
    private Label txtKMRecorridos;

    @FXML
    private Label txtParticipar;

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