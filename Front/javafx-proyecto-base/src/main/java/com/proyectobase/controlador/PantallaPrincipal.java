package com.proyectobase.controlador;

import apirest.ServicioLeerCarreras;
import com.google.gson.GsonBuilder;
import com.proyectobase.modelo.ApiResponse;
import javafx.scene.input.MouseEvent;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.image.ImageView;
import com.proyectobase.modelo.Carrera;
import com.proyectobase.modelo.LocalDateTimeAdapter;
import java.util.List;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.TableRow;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;
import javafx.scene.layout.CornerRadii;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

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
    private TableColumn<Carrera, Double> columnDesnivel;

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
    private Label txtCarreras, txtCorredores, txtKMRecorridos, txtParticipar;

    @FXML
    private VBox vboxCarreras;

    @FXML
    private VBox vboxCorredores;

    @FXML
    private VBox vboxImagen;

    @FXML
    private VBox vboxRecorridos;

    @FXML
    private TableColumn<Carrera, String> columnParticipando;

    @FXML
    void btnAccionDesapuntarse(ActionEvent event) {
        Carrera carreraSeleccionada = tvCarreras.getSelectionModel().getSelectedItem();

        if (carreraSeleccionada != null) {
            carreraSeleccionada.setParticipando("No");
            tvCarreras.refresh();
        } else {
            System.out.println("No hay una carrera seleccionada.");
        }
    }

    @FXML
    void btnAccionParticipar(ActionEvent event) {
        Carrera carreraSeleccionada = tvCarreras.getSelectionModel().getSelectedItem();

        if (carreraSeleccionada != null) {
            carreraSeleccionada.setParticipando("Sí");
            tvCarreras.refresh();
        } else {
            System.out.println("No hay una carrera seleccionada.");
        }
    }

    @FXML
    void navegarLogin(MouseEvent event) {

    }

    private ServicioLeerCarreras servicioLeer;

    private void aplicarEfectoHover(ImageView imagenVista) {
        imagenVista.setOnMouseEntered(event -> {
            imagenVista.setScaleX(1.2);
            imagenVista.setScaleY(1.2);
        });

        imagenVista.setOnMouseExited(event -> {
            imagenVista.setScaleX(1.0);
            imagenVista.setScaleY(1.0);
        });
    }

    ObservableList<Carrera> listaCarreras;

    public void obtenerListaCarreras() {
        String baseUrl = "http://18.233.155.66/api/races/";

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(new GsonBuilder()
                        .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                        .create()))
                .build();

        servicioLeer = retrofit.create(ServicioLeerCarreras.class);

        Call<ApiResponse> nuevaCallLect = servicioLeer.getCarrera();

        nuevaCallLect.enqueue(new Callback<ApiResponse>() {
            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                System.out.println("Network Error :: " + t.getLocalizedMessage());
            }

            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                Platform.runLater(() -> {
                    if (response.isSuccessful() && response.body() != null) {
                        List<Carrera> carreras = response.body().getRaces();
                        System.out.println("Carreras obtenidas: " + carreras.size());
                        if (carreras != null && !carreras.isEmpty()) {
                            tvCarreras.setItems(FXCollections.observableArrayList(carreras));

                            System.out.println(FXCollections.observableArrayList(carreras).get(0).getId());
                        } else {
                            System.out.println("No hay carreras disponibles.");
                        }
                    } else {
                        System.out.println("Error al obtener carreras: " + response.code() + " - " + response.message());
                    }
                });
            }

        });
    }

    public void inicializarTablaCarreras() {
        try {
            columnNombre.setCellValueFactory(new PropertyValueFactory<>("name"));
            columnLocalizacion.setCellValueFactory(new PropertyValueFactory<>("location"));
            columnDistancia.setCellValueFactory(new PropertyValueFactory<>("distance"));
            columnDesnivel.setCellValueFactory(new PropertyValueFactory<>("unevenness"));
            columnTiempo.setCellValueFactory(new PropertyValueFactory<>("qualifyingTime"));
            columnFecha.setCellValueFactory(new PropertyValueFactory<>("date"));
            columnEstado.setCellValueFactory(new PropertyValueFactory<>("status"));
            columnTour.setCellValueFactory(new PropertyValueFactory<>("tour"));
            obtenerListaCarreras();

        } catch (Exception ex) {
            System.out.println("Error en inicializarTablaCarreras: " + ex.getMessage());
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        Platform.runLater(() -> {
            Stage stage = (Stage) txtCarreras.getScene().getWindow();
            stage.getIcons().add(new Image(getClass().getClassLoader().getResourceAsStream("logo.jpeg")));

            Scene scene = txtCarreras.getScene();
            scene.getStylesheets().add(getClass().getResource("/style.css").toExternalForm());
        });
        inicializarTablaCarreras();
        aplicarEfectoHover(imgUsuario);

        columnParticipando.setCellValueFactory(param -> param.getValue().participandoProperty1());

        Image imagen = new Image(getClass().getResource("/fondo.jpeg").toExternalForm());

        BackgroundImage fondoImagen = new BackgroundImage(
                imagen,
                BackgroundRepeat.NO_REPEAT,
                BackgroundRepeat.NO_REPEAT,
                BackgroundPosition.CENTER,
                new BackgroundSize(100, 100, true, true, true, true)
        );

        vboxImagen.setBackground(new Background(fondoImagen));

        BackgroundFill fondoLleno = new BackgroundFill(
                Color.rgb(255, 255, 255, 0.5),
                new CornerRadii(10),
                Insets.EMPTY.EMPTY
        );

        Background fondoBlancoOpaco = new Background(fondoLleno);

        vboxCorredores.setBackground(fondoBlancoOpaco);
        vboxCarreras.setBackground(fondoBlancoOpaco);
        vboxRecorridos.setBackground(fondoBlancoOpaco);

        aplicarEstiloTabla(tvCarreras);
        aplicarEstiloTabla(tableViewPuestos);
    }

    private void aplicarEstiloTabla(TableView<Carrera> tabla) {
        tabla.setStyle("-fx-background-color: #B4C7B2; ");

        tabla.getColumns().forEach(columna -> {
            columna.setStyle("-fx-background-color: #9B9D79; ");
        });

        tabla.setRowFactory(tv -> {
            return new TableRow<>() {
                @Override
                protected void updateItem(Carrera item, boolean vacio) {
                    super.updateItem(item, vacio);
                    if (item != null) {
                        setStyle("-fx-background-color: " + (isSelected() ? "#8EAC93" : "#B4C7B2") + ";");
                    }
                }
            };
        });
    }

}