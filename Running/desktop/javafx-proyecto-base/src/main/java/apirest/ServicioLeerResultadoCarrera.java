/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apirest;

import com.proyectobase.modelo.ApiResponse;
import retrofit2.Call;
import retrofit2.http.GET;

/**
 *
 * @author Santiago
 */
public interface ServicioLeerResultadoCarrera {
    @GET(".")
    Call<ApiResponse> getResultado();
}
