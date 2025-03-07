
package crud;

import javafx.application.Application;
import static javafx.application.Application.launch;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

public class Main extends Application{
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage)throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/vista/login.fxml"));
        
        stage.getIcons().add(new Image(getClass().getResourceAsStream("/icono.png")));
        stage.setTitle("Ciclismo APP - Login");
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setResizable(false);
        
        stage.show();
    }
}
