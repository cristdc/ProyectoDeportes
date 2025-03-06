/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apirest;

import java.util.List;
import com.proyectobase.modelo.Carrera;
import retrofit2.Call;
import retrofit2.http.GET;

/**
 *
 * @author Juanan
 */
public interface ServicioLeerCarreras {
    @GET("races")
    Call<List<Carrera>> getCarrera();
}
