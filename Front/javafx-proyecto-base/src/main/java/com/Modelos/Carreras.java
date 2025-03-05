package com.Modelos;

import java.time.LocalDateTime;
import java.util.List;

public class Carreras {
    private String id;
    private String name;
    private String sport;
    private LocalDateTime date;
    private String location;
    private double distance;
    private int maxParticipants;
    private int unevenness;
    private String tour;
    private String qualifyingTime;
    private List<Classification> classification;
    private String createdBy;
    private String status;
    private LocalDateTime createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public int getUnevenness() {
        return unevenness;
    }

    public void setUnevenness(int unevenness) {
        this.unevenness = unevenness;
    }

    public String getTour() {
        return tour;
    }

    public void setTour(String tour) {
        this.tour = tour;
    }

    public String getQualifyingTime() {
        return qualifyingTime;
    }

    public void setQualifyingTime(String qualifyingTime) {
        this.qualifyingTime = qualifyingTime;
    }

    public List<Classification> getClassification() {
        return classification;
    }

    public void setClassification(List<Classification> classification) {
        this.classification = classification;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Classification {
        private String corredor;
        private int tiempo;

        public Classification(String corredor, int tiempo) {
            this.corredor = corredor;
            this.tiempo = tiempo;
        }

        public String getCorredor() {
            return corredor;
        }

        public void setCorredor(String corredor) {
            this.corredor = corredor;
        }

        public int getTiempo() {
            return tiempo;
        }

        public void setTiempo(int tiempo) {
            this.tiempo = tiempo;
        }
    }
}