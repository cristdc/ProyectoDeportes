/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apirest;

import com.Modelos.Usuarios;
import retrofit2.http.GET;
import retrofit2.Call;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 *
 * @author Daniel escobar
 * 
 * Habrá que configurar la interface según hayamos construido la API
 * En este caso hay que pasar las cabeceras que indica la API y utilizar el método indicado en la API: GET
 */
public interface MiAPIServicioLogin {
        @POST("users/login")
        Call<Usuarios> getUsers();
}