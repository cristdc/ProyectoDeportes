/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modelo;

/**
 *
 * @author Marcos
 */
// Clase para almacenar los datos del usuario
public class UserSession {
    private static User usuarioAutenticado;

    public static User getUsuarioAutenticado() {
        return usuarioAutenticado;
    }

    public static void setUsuarioAutenticado(User usuario) {
        usuarioAutenticado = usuario;
    }
}
