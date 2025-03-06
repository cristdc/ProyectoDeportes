/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controlador;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.fxml.Initializable;
import modelo.User;
import modelo.UserSession;

/**
 *
 * @author Marcos
 */
public class ControladorVista implements Initializable{

    private User usuarioAutenticado;
    
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        usuarioAutenticado = UserSession.getUsuarioAutenticado();

    }
    
}
