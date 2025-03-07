package apirest;

import com.proyectobase.modelo.ApiResponse;
import java.util.List;
import com.proyectobase.modelo.Carrera;
import retrofit2.Call;
import retrofit2.http.GET;

/**
 *
 * @author Juanan
 */
public interface ServicioLeerCarreras {
<<<<<<< HEAD
    @GET("races")
    Call<List<Carrera>> getCarrera();
=======
    @GET(".")
    Call<ApiResponse> getCarrera();
>>>>>>> 4768f3a92217ff54669779d5e95b5bb62cacb92c
}
