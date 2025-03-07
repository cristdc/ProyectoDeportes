package com.proyectobase.modelo;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/**
 *
 * @author Santiago
 */
public class ApiResponse {
    @SerializedName("races")
    private List<Carrera> races;

    public List<Carrera> getRaces() {
        return races;
    }

    public void setRaces(List<Carrera> races) {
        this.races = races;
    }
}
