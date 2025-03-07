
package modelo;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class ApiResponse {
    @SerializedName("races")
    private List<Race> races;
    
    public List<Race> getRaces(){
        return races;
    }
    
    public void setRaces(List<Race> races){
        this.races = races;
    }
    
}
