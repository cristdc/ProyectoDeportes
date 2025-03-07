package controlador;

import api.RetrofitClient;
import api.ServicioLeerRacer;
import api.ServicioLeerResultadoCarrera;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ResourceBundle;
import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableRow;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;
import javafx.scene.layout.CornerRadii;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import modelo.ApiResponse;
import modelo.Race;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ControladorCarreras implements Initializable{
    @FXML
    private VBox vBoxRecorridos;
    @FXML
    private VBox vBoxCarreras;
    @FXML
    private VBox vboxCiclistas;
    
    @FXML
    private VBox VBoxImage;
    
    @FXML
    private TableView<Race> TableViewCarreras;

    @FXML
    private TableView<Race> TableViewInicio;

    @FXML
    private Button btnDesapuntarse;

    @FXML
    private Button btnParticipar;

    @FXML
    private Label lblCarreras;

    @FXML
    private Label lblCiclistas;

    @FXML
    private Label lblRecorridos;

    @FXML
    private TableColumn<Race, Double> tv2Distancia;

    @FXML
    private TableColumn<Race, String> tv2Estado;

    @FXML
    private TableColumn<Race, LocalDateTime> tv2Fecha;

    @FXML
    private TableColumn<Race, String> tv2Localizacion;

    @FXML
    private TableColumn<Race, String> tv2Nombre;

    @FXML
    private TableColumn<Race, Double> tv2Tiempo;

    @FXML
    private TableColumn<Race, String> tv2Tour;

    @FXML
    private TableColumn<Race, String> tvNombre;

    @FXML
    private TableColumn<Race, String> tv2Participando;

    @FXML
    private TableColumn<Race, Integer> tvPuesto;

    @FXML
    private TableColumn<Race, Double> tvTiempo;
    @FXML
    private ImageView imgUsuario;
    
    
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        inicializarTablaRace();
        
        aplicarEfectoHover(imgUsuario);
        
        tv2Participando.setCellValueFactory(cellData -> cellData.getValue().participandoProperty());

        Image imagen = new Image(getClass().getResource("/ciclistas.png").toExternalForm());

        BackgroundImage fondoImagen = new BackgroundImage(
                imagen,
                BackgroundRepeat.NO_REPEAT,
                BackgroundRepeat.NO_REPEAT,
                BackgroundPosition.CENTER,
                new BackgroundSize(100, 100, true, true, true, true)
        );

        VBoxImage.setBackground(new Background(fondoImagen));

        BackgroundFill fondoLleno = new BackgroundFill(
                Color.rgb(255, 255, 255, 0.5),
                new CornerRadii(10),
                Insets.EMPTY.EMPTY
        );

        Background fondoBlancoOpaco = new Background(fondoLleno);

        vboxCiclistas.setBackground(fondoBlancoOpaco);
        vBoxCarreras.setBackground(fondoBlancoOpaco);
        vBoxRecorridos.setBackground(fondoBlancoOpaco);

        aplicarEstiloTabla(TableViewInicio);
        aplicarEstiloTabla(TableViewInicio);
        
        
    }
    @FXML
    void desapuntarseCarrera(ActionEvent event) {
        Race carreraSeleccionada = TableViewCarreras.getSelectionModel().getSelectedItem();

        if (carreraSeleccionada != null) {
            carreraSeleccionada.setParticipando("No");
            TableViewCarreras.refresh();
        } else {
            System.out.println("No hay una carrera seleccionada.");
        }
    }

    @FXML
    void apuntarseCarrera(ActionEvent event) {
        Race carreraSeleccionada = TableViewCarreras.getSelectionModel().getSelectedItem();

        if (carreraSeleccionada != null) {
            carreraSeleccionada.setParticipando("Sí");
            TableViewCarreras.refresh();
        } else {
            System.out.println("No hay una carrera seleccionada.");
        }
    }


    
    
    
    ObservableList<Race> listaCarreras;
    private ServicioLeerRacer servicioLeer;
    
    public void obtenerListaRace() {
        

        servicioLeer = RetrofitClient.getClientRace().create(ServicioLeerRacer.class);

        Call<ApiResponse> nuevaCallLect = servicioLeer.getRaces();
        
        nuevaCallLect.enqueue(new Callback<ApiResponse>() {
            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                System.out.println("Network Error :: " + t.getLocalizedMessage());
            }

            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                Platform.runLater(() -> {
                    if (response.isSuccessful() && response.body() != null) {
                        List<Race> carreras = response.body().getRaces();
                        System.out.println("Carreras obtenidas: " + carreras.size());
                        if (carreras != null && !carreras.isEmpty()) {
                            TableViewCarreras.setItems(FXCollections.observableArrayList(carreras));
                            
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
    
    public void inicializarTablaRace(){
        try {
            tv2Nombre.setCellValueFactory(new PropertyValueFactory<>("name"));
            tv2Localizacion.setCellValueFactory(new PropertyValueFactory<>("location"));
            tv2Distancia.setCellValueFactory(new PropertyValueFactory<>("distance"));
            tv2Tiempo.setCellValueFactory(new PropertyValueFactory<>("qualifyingTime"));
            tv2Fecha.setCellValueFactory(new PropertyValueFactory<>("date"));
            tv2Estado.setCellValueFactory(new PropertyValueFactory<>("status"));
            tv2Tour.setCellValueFactory(new PropertyValueFactory<>("tour"));
            obtenerListaRace();

        } catch (Exception ex) {
            System.out.println("Error en inicializarTablaCarreras: " + ex.getMessage());
        }

    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public void inicializarTablaResultados() {
        try {
            tvPuesto.setCellValueFactory(new PropertyValueFactory<>("puesto"));
            tvNombre.setCellValueFactory(new PropertyValueFactory<>("nombre"));
            tvTiempo.setCellValueFactory(new PropertyValueFactory<>("tiempo"));
            obtenerListaResultadoUltimaCarrera();
        } catch (Exception ex) {
            System.out.println("Error en inicializarTablaResultados: " + ex.getMessage());
        }
    }
    
    public String idUltimaCarrera;
    private ServicioLeerResultadoCarrera servicioLeerResultado;
    
    public void obtenerListaResultadoUltimaCarrera() {


        servicioLeerResultado = RetrofitClient.getClientRace().create(ServicioLeerResultadoCarrera.class);

        Call<ApiResponse> nuevaCallLect = servicioLeerResultado.getResultado(idUltimaCarrera);
        
        nuevaCallLect.enqueue(new Callback<ApiResponse>() {
            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                System.out.println("Network Error :: " + t.getLocalizedMessage());
            }

            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                Platform.runLater(() -> {
                    if (response.isSuccessful() && response.body() != null) {
                        List<Race> resultados = response.body().getRaces();
                        System.out.println("Carreras obtenidas: " + resultados.size());
                        if (resultados != null && !resultados.isEmpty()) {
                            TableViewInicio.setItems(FXCollections.observableArrayList(resultados));
                            

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
    
    private void aplicarEstiloTabla(TableView<Race> tabla) {
        tabla.setStyle("-fx-background-color: #B4C7B2; ");

        tabla.getColumns().forEach(columna -> {
            columna.setStyle("-fx-background-color: #9B9D79; ");
        });

        tabla.setRowFactory(tv -> {
            return new TableRow<>() {
                @Override
                protected void updateItem(Race item, boolean vacio) {
                    super.updateItem(item, vacio);
                    if (item != null) {
                        setStyle("-fx-background-color: " + (isSelected() ? "#8EAC93" : "#B4C7B2") + ";");
                    }
                }
            };
        });
    }

}
