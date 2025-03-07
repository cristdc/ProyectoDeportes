/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectobase.modelo;

import com.google.gson.annotations.SerializedName;
import java.time.LocalDateTime;
import java.util.List;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

/**
 *
 * @author Juanan
 */
public class Carrera {

    private String _id;
    private String name;
    private String location;
    private Double distance;
    private String qualifyingTime;
    private LocalDateTime date;
    private String status;
    private String tour;
    private StringProperty participando = new SimpleStringProperty("No");

    public String getParticipando() {
        return participando.get();
    }

    public void setParticipando(String participando) {
        this.participando.set(participando);
    }
    
    public String participandoProperty(){
        return this.participando.get();
    }
    
    public StringProperty participandoProperty1(){
        return participando;
    }
    
    
    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public void setQualifyingTime(String qualifyingTime) {
        this.qualifyingTime = qualifyingTime;
    }

    public String getQualifyingTime() {
        return qualifyingTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTour() {
        return tour;
    }

    public void setTour(String tour) {
        this.tour = tour;
    }
}
