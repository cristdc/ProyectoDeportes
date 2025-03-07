package com.proyectobase.controlador;

import apirest.ServicioLeerCarreras;
import apirest.ServicioLeerResultadoCarrera;
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
    private TableColumn<Carrera,String> columnParticipando;
    

    @FXML
    void btnAccionDesapuntarse(ActionEvent event) {
        
    }

    @FXML
    void btnAccionParticipar(ActionEvent event) {
        
    }

    @FXML
    void navegarLogin(MouseEvent event) {

    }
    
    
    
    private ServicioLeerCarreras servicioLeer;
    private ServicioLeerResultadoCarrera servicioLeerResultado;

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
    String idUltimaCarrera;
    public void obtenerListaCarreras() {
        String baseUrl = "http://44.203.132.49:3000/api/races/";

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
                            idUltimaCarrera =  FXCollections.observableArrayList(carreras).get(0).getId();
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
    
    
    public void obtenerListaResultadoUltimaCarrera() {
        String baseUrl = "http://44.203.132.49:3000/api/races/"+idUltimaCarrera+"/results";

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(new GsonBuilder()
                        .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) 
                        .create()))
                .build();

        servicioLeerResultado = retrofit.create(ServicioLeerResultadoCarrera.class);

        Call<ApiResponse> nuevaCallLect = servicioLeerResultado.getResultado();
        
        nuevaCallLect.enqueue(new Callback<ApiResponse>() {
            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                System.out.println("Network Error :: " + t.getLocalizedMessage());
            }

            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                Platform.runLater(() -> {
                    if (response.isSuccessful() && response.body() != null) {
                        List<Carrera> resultados = response.body().getRaces();
                        System.out.println("Carreras obtenidas: " + resultados.size());
                        if (resultados != null && !resultados.isEmpty()) {
                            tableViewPuestos.setItems(FXCollections.observableArrayList(resultados));
                            
                            System.out.println(FXCollections.observableArrayList(resultados).get(0).getId());
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
            //columnId.setCellValueFactory(new PropertyValueFactory<>("id"));
            columnNombre.setCellValueFactory(new PropertyValueFactory<>("name"));
            columnLocalizacion.setCellValueFactory(new PropertyValueFactory<>("location"));
            columnDistancia.setCellValueFactory(new PropertyValueFactory<>("distance"));
            columnTiempo.setCellValueFactory(new PropertyValueFactory<>("qualifyingTime"));
            columnFecha.setCellValueFactory(new PropertyValueFactory<>("date"));
            columnEstado.setCellValueFactory(new PropertyValueFactory<>("status"));
            columnTour.setCellValueFactory(new PropertyValueFactory<>("tour"));
            obtenerListaCarreras();

        } catch (Exception ex) {
            System.out.println("Error en inicializarTablaCarreras: " + ex.getMessage());
        }
    }
    
    public void inicializarTablaResultados() {
        try {
            columnPuesto.setCellValueFactory(new PropertyValueFactory<>(""));
            columnNombreCorredor.setCellValueFactory(new PropertyValueFactory<>(""));
            columnTiempoCorredor.setCellValueFactory(new PropertyValueFactory<>(""));
            obtenerListaResultadoUltimaCarrera();
        } catch (Exception ex) {
            System.out.println("Error en inicializarTablaResultados: " + ex.getMessage());
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        inicializarTablaCarreras();
        inicializarTablaResultados();
        
        
        
        
        aplicarEfectoHover(imgUsuario);
        
        columnParticipando.setCellValueFactory(param -> {
            return new javafx.beans.property.SimpleStringProperty("No");
        });

        Image imagen = new Image(getClass().getResource("/imagenRunning.png").toExternalForm());

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
