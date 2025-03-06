/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectobase.vista;

import java.io.IOException;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 *
 * @author crist
 */
public class Main extends Application{
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primeraEscena) throws Exception {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/proyectobase/vista/ventanaLogin.fxml"));
            Parent root = loader.load();
            Scene scene = new Scene(root);
            primeraEscena.setScene(scene);
            primeraEscena.setTitle("Running");
           //  primeraEscena.getIcons().add(new Image(getClass().getResource("/img/star.png").toString()));
            primeraEscena.show();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
