package com.proyectobase.controlador;

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
import java.io.IOException;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.TableRow;
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
    void btnAccionDesapuntarse(ActionEvent event) {

    }

    @FXML
    void btnAccionParticipar(ActionEvent event) {

    }

    @FXML
    void navegarLogin(MouseEvent event) {
        Platform.runLater(() -> {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/proyectobase/vista/ventanaLogin.fxml"));
                Parent root = loader.load();
                Stage stage = new Stage();
                stage.setScene(new Scene(root));
                stage.setTitle("Running");
                stage.show();

                // Cierra la ventana de inicio de sesión
                Stage principalStage = (Stage) imgUsuario.getScene().getWindow();
                principalStage.close();
            } catch (IOException e) {
                e.printStackTrace();
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

    @Override
    public void initialize(URL url, ResourceBundle rb) {

        aplicarEfectoHover(imgUsuario);

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
