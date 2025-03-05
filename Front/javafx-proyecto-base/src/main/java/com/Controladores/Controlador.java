/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.Controladores;

import com.Modelos.Carreras;
import com.apirest.MiAPIServicioLeer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.net.URL;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Hyperlink;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 *
 * @author danie
 */
public class Controlador extends Application {
    
    
        @FXML
    private HBox body;

    @FXML
    private Hyperlink enlaceCarreras;

    @FXML
    private Hyperlink enlaceParticipar;

    @FXML
    private VBox header;

    @FXML
    private ImageView imgLogo;

    @FXML
    private ImageView imgUsuario;

    @FXML
    private AnchorPane root;

    @FXML
    private VBox section1;

    @FXML
    private VBox section2;

    @FXML
    private HBox sections;

     private Stage mistage;
    private Call<Carreras> callLect;
    

    @Override
    public void start(Stage stage) {
        mistage = stage;
        String baseUrl = "http://192.168.50.143:3000/api/";

        Gson gson = new GsonBuilder().setLenient().create();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();

        MiAPIServicioLeer servicioLeer = retrofit.create(MiAPIServicioLeer.class);
        URL imageUrl = getClass().getClassLoader().getResource("img/AtletisticsLogo.png");
        if (imageUrl != null) {
            Image image = new Image(imageUrl.toString());
            stage.getIcons().add(image);
        } else {
            System.out.println("No se encontró la imagen en el ClassLoader.");
        }

        stage.setTitle("Trail Running");
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/proyectobase/Ventanas/Principal.fxml"));
            
            Parent root = loader.load();
            Controlador controller = loader.getController();

            controller.callLect = servicioLeer.getRaces();

            Scene scene = new Scene(root, 800, 600);
            stage.setScene(scene);
            stage.show();

            controller.encolaLectura();
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error cargando la interfaz gráfica: " + e.getMessage());
        }
    }
    
    
    public void encolaLectura() { 

        callLect.enqueue(new Callback<Carreras>() {
            @Override
            public void onFailure(Call<Carreras> call, Throwable t) {
                Platform.runLater(() -> System.out.println("Error de red: " + t.getLocalizedMessage()));
            }

            @Override
            public void onResponse(Call<Carreras> call, Response<Carreras> response) {
                Platform.runLater(() -> {
                    if(response.isSuccessful()){
                        //procesarRespuesta(response);
                    }
                
            });
            }
        });
    }
        
}
