package com.proyectobase.controlador;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.awt.event.MouseEvent;
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ResourceBundle;
import javafx.application.Platform;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
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
import com.proyectobase.modelo.Carrera;
import com.proyectobase.modelo.Usuario;

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
    private TableColumn<Carrera, LocalDateTime> columnFecha;

    @FXML
    private TableColumn<Carrera, String> columnId;

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
    private TableColumn<Carrera, String> columnTour;

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
