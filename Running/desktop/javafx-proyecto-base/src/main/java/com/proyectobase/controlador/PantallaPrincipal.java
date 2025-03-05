import java.net.URL;
import java.util.ResourceBundle;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.image.ImageView;

public class PantallaPrincipal implements Initializable {

    @FXML
    private ImageView imgLogo;

    @FXML
    private ImageView imgUsuario;

    @FXML
    private TableView<?> tableViewPuestos;

    @FXML
    private Label txt;

    @FXML
    private Label txtCarreras;

    @FXML
    private Label txtCorredores;

    @FXML
    private Label txtKMRecorridos;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        
    }

}
