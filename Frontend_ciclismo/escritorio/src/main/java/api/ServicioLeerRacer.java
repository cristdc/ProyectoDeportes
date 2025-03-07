
package api;

import modelo.ApiResponse;
import retrofit2.Call;
import retrofit2.http.GET;

public interface ServicioLeerRacer {
    @GET("races")
    Call<ApiResponse> getRaces();
}
