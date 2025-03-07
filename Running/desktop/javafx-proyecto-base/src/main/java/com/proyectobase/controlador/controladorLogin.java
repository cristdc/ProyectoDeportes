package com.proyectobase.controlador;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ResourceBundle;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Scene;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import javafx.stage.Stage;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.proyectobase.modelo.LoginRequest;
import com.proyectobase.modelo.Usuario;

import apirest.ServicioLeerUsuario;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class controladorLogin implements Initializable {

    @FXML
    private Button btnIniciarSesion;

    @FXML
    private PasswordField txtPassword;

    @FXML
    private TextField txtUsuario;

    private ServicioLeerUsuario servicioLeerUsuario;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        Platform.runLater(() -> {
            Stage stage = (Stage) txtPassword.getScene().getWindow();
            stage.getIcons().add(new Image(getClass().getClassLoader().getResourceAsStream("logo.png")));
        });
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://192.168.50.143:3000/api/") // Cambia esto a tu URL de API
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();

        servicioLeerUsuario = retrofit.create(ServicioLeerUsuario.class);
    }

    @FXML
    void btniniciarsesion(ActionEvent event) {
        String email = txtUsuario.getText();
        String password = txtPassword.getText();

        if (email.isEmpty() || password.isEmpty()) {
            showAlert("Error", "Email y contraseña no deben estar vacíos");
            return;
        }

        LoginRequest loginRequest = new LoginRequest(email, password);
        Call<Usuario> call = servicioLeerUsuario.getUsers(loginRequest);

        call.enqueue(new Callback<Usuario>() {
            @Override
            public void onResponse(Call<Usuario> call, Response<Usuario> response) {
                Platform.runLater(() -> {
                    if (response.isSuccessful()) {
                        Usuario usuario = response.body();
                        abrirPantallaPrincipal();
                    } else {
                        showAlert("Error", "Inicio de sesión fallido: " + response.message());
                    }
                });
            }

            @Override
            public void onFailure(Call<Usuario> call, Throwable t) {
                Platform.runLater(() -> showAlert("Error", "Inicio de sesión fallido: " + t.getMessage()));
            }
        });
    }

    private void abrirPantallaPrincipal() {
        Platform.runLater(() -> {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/proyectobase/vista/pantallaPrincipal.fxml"));
                Parent root = loader.load();
                Stage stage = new Stage();
                stage.setScene(new Scene(root));
                stage.setTitle("Pantalla Principal");
                stage.show();

                Stage loginStage = (Stage) btnIniciarSesion.getScene().getWindow();
                loginStage.close();
            } catch (IOException e) {
                e.printStackTrace();
                showAlert("Error", "No se pudo abrir Pantalla Principal");
            }
        });
    }

    private void showAlert(String title, String message) {
        Platform.runLater(() -> {
            Alert alert = new Alert(AlertType.INFORMATION);
            alert.setTitle(title);
            alert.setHeaderText(null);
            alert.setContentText(message);
            alert.showAndWait();
        });
    }

    private class LocalDateTimeAdapter extends TypeAdapter<LocalDateTime> {

        private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        @Override
        public void write(JsonWriter out, LocalDateTime value) throws IOException {
            out.value(value.format(formatter));
        }

        @Override
        public LocalDateTime read(JsonReader in) throws IOException {
            return LocalDateTime.parse(in.nextString(), formatter);
        }
    }
}