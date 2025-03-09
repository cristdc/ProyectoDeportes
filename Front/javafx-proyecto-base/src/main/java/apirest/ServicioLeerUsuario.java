/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apirest;

import com.proyectobase.modelo.LoginRequest;
import com.proyectobase.modelo.Usuario;
import retrofit2.http.GET;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 *
 * @author Usuario
 * 
 * Habrá que configurar la interface según hayamos construido la API
 * En este caso hay que pasar las cabeceras que indica la API y utilizar el método indicado en la API: GET
 */
public interface ServicioLeerUsuario {
    @POST("users/login")
    @Headers("Content-Type: application/json")
    Call<Usuario> getUsers(@Body LoginRequest loginRequest);
}