
package controlador;

import api.RetrofitClient;
import java.net.URL;
import java.util.ResourceBundle;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;
import modelo.User;
import modelo.UserSession;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ControladorLogin implements Initializable{
    @FXML
    private ImageView imgLogin;
    
    @FXML
    private Button btnIngresarLogin;

    @FXML
    private Label lblErrorLogin;

    @FXML
    private Label lblLogin;

    @FXML
    private Label lblLogin1;

    @FXML
    private Pane loginPane;

    @FXML
    private PasswordField txtContrasenaLogin;

    @FXML
    private TextField txtCorreoLogin;
    
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        
        imgLogin.setImage(new Image(getClass().getClassLoader().getResourceAsStream("foto.jpg")));
        txtCorreoLogin.textProperty().addListener((observable, oldValue, newValue) -> {
            comprobarCamposLogin();
        });

        txtContrasenaLogin.textProperty().addListener((observable, oldValue, newValue) -> {
            comprobarCamposLogin();
        });

        btnIngresarLogin.setDisable(true);
        
    }
    
    
    private void abrirVistaPrincipal() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/vista/ciclismo.fxml"));
            Parent root = loader.load();

            Stage loginStage = (Stage) btnIngresarLogin.getScene().getWindow();
            loginStage.close(); 

            Stage stage = new Stage();
            stage.setTitle("Ciclismo APP - Inicio");
            Scene scene = new Scene(root);
            stage.setScene(scene);
            stage.show();
        } catch (Exception e) {
            System.out.println("Error al cargar la vista de usuario: " + e.getMessage());
            e.printStackTrace();
        }
    }


    
    private void comprobarCamposLogin() {
        String correo = txtCorreoLogin.getText();
        String contrasena = txtContrasenaLogin.getText();

        boolean camposRellenos = !correo.isEmpty() && !contrasena.isEmpty();
        btnIngresarLogin.setDisable(!camposRellenos);
    }
    
    
    //ACCION DEL BOTON INGRESAR DEL LOGIN (ACCESO A VISTA PRINCIPAL CARRERAS)
    @FXML
    void accederVista(ActionEvent event) {
        try {
            String correo = txtCorreoLogin.getText().trim();
            String contrasena = txtContrasenaLogin.getText().trim();
            if (correo.isEmpty() || contrasena.isEmpty()) {
                lblErrorLogin.setText("Por favor, ingrese correo y contraseña.");
                lblErrorLogin.setStyle("-fx-text-fill: red;");
                return;
            }

            lblErrorLogin.setText("");
            
            System.out.println("Intentando acceder con correo: " + correo);
            LoginRequest loginRequest = new LoginRequest(correo, contrasena);
            ServiceAPI serviceAPI = RetrofitClient.getClient();
            Call<LoginResponse> call = serviceAPI.login(loginRequest);
            System.out.println("Enviando solicitud a la API...");
            
            call.enqueue(new Callback<LoginResponse>() {
                
                @Override
                public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                    Platform.runLater(() -> {
                        if (response.isSuccessful()) {
                            LoginResponse loginResponse = response.body();
                            if (loginResponse != null) {
                                User apiUser = loginResponse.getUser();
                                System.out.println("Inicio de sesión exitoso: " + loginResponse.getMessage());
                                System.out.println("Detalles del usuario: " + apiUser);

                                UserSession.setUsuarioAutenticado(apiUser);
                                abrirVistaPrincipal();
                            }
                        } else {
                            System.out.println("Error en la respuesta: Código de error " + response.code());
                            lblErrorLogin.setText("Correo o contraseña incorrecta");
                            lblErrorLogin.setStyle("-fx-text-fill: red;");
                        }
                    });
                }


                @Override
                public void onFailure(Call<LoginResponse> call, Throwable t) {
                    Platform.runLater(() -> {
                        System.out.println("Error al realizar la solicitud: " + t.getMessage());
                        lblErrorLogin.setText("Error de conexión: " + t.getMessage());
                        lblErrorLogin.setStyle("-fx-text-fill: red;");
                    });
                }

            });
        } catch (Exception e) {
            e.printStackTrace();
            lblErrorLogin.setText("Error inesperado: " + e.getMessage());
            lblErrorLogin.setStyle("-fx-text-fill: red;");
        }
    }
}
