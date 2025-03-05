package com.proyectobase; //Modificar al package correcto

import javafx.application.Application;
import static javafx.application.Application.launch;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import com.Controladores.Controlador;
import java.io.IOException;
import java.net.URL;
import javafx.application.Application;
import static javafx.application.Application.launch;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

/**
 * Plantilla JAVAFX
 * Autor:
 * Curso y año:
 * Objetivo de esta clase:
 */
public class PlantillaFX extends Application {

    public static void main(String[] args) {
        launch(args);
    }


    @Override        
    public void start(Stage primaryStage) throws IOException {
              
        

        // Cargar el archivo FXML correctamente
        Parent root = new FXMLLoader(getClass().getResource("/Vistas/Login.fxml")).load();
        //FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/Vistas/Login.fxml"));
        //Parent root = loader.load(); // Ahora podemos obtener el controlador
        
        URL imageUrl = getClass().getClassLoader().getResource("img/AtletisticsLogo.jpg");
        if (imageUrl != null) {
            Image image = new Image(imageUrl.toString());
            primaryStage.getIcons().add(image);
        } else {
            System.out.println("No se encontró la imagen en el ClassLoader.");
        }

        // Obtener el controlador y configurar el eve/nto de teclado
        //Controlador controller = loader.getController();

        // Crear la escena correctamente
        Scene scene = new Scene(root);

        // Configurar la ventana principal
        primaryStage.setScene(scene);
        primaryStage.setTitle("Atletistics");
        primaryStage.show();
        
    }

}
