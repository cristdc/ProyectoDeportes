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
    @GET(".")
    Call<ApiResponse> getCarrera();
}
