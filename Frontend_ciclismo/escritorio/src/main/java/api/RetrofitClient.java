
package api;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static RetrofitClient retrofit = null;

    public static RetrofitClient getClient() {
        if (retrofit == null) {

            retrofit = new RetrofitClient.Builder()
                    .baseUrl("http://localhost:3000/api/users")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
