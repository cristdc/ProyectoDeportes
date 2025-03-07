
package api;

import modelo.ApiResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ServicioLeerResultadoCarrera {
    @GET("races/{id}/results")
    Call<ApiResponse> getResultado(
        @Path("id") String raceId
    );
}
