
package controlador;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;


public interface ServiceAPI {
    
    @POST("users/login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);
}
