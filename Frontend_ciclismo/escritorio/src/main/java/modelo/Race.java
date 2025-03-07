
package modelo;

import java.util.Date;
import java.util.List;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;


public class Race {
    private String _id;               // Identificador único (ObjectId en la BD)
    private String name;              // Nombre de la carrera
    private String sport;             // Tipo de deporte: "running", "trail", "cycling"
    private Date date;                // Fecha y hora del evento
    private String location;          // Ubicación donde se realiza la carrera
    private double distance;          // Distancia en kilómetros
    private int maxParticipants;      // Número máximo de participantes
    private int unevenness;           // Desnivel total en metros
    private String tour;              // URL o referencia a un archivo GPX con la ruta
    private String qualifyingTime;    // Tiempo de clasificación necesario
    private List<String> classification; // Lista de IDs de los ganadores
    private String createdBy;         // ID del administrador que creó la carrera (ObjectId en la BD)
    private String status;            // Estado de la carrera: "open", "closed", "finished"
    private Date createdAt;           // Fecha en la que se registró la carrera
    private StringProperty participando = new SimpleStringProperty("No");


    // Constructor vacío
    public Race() {
    }

    // Constructor con todos los campos
    public Race(String _id, String name, String sport, Date date, String location, double distance, 
                int maxParticipants, int unevenness, String tour, String qualifyingTime, 
                List<String> classification, String createdBy, String status, Date createdAt) {
        this._id = _id;
        this.name = name;
        this.sport = sport;
        this.date = date;
        this.location = location;
        this.distance = distance;
        this.maxParticipants = maxParticipants;
        this.unevenness = unevenness;
        this.tour = tour;
        this.qualifyingTime = qualifyingTime;
        this.classification = classification;
        this.createdBy = createdBy;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters y Setters

    public String getParticipando() {
        return participando.get();
    }

    public void setParticipando(String participando) {
        this.participando.set(participando);
    }

    // Método property: Único y correcto para JavaFX
    public StringProperty participandoProperty() {
        return participando;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
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

    public List<String> getClassification() {
        return classification;
    }

    public void setClassification(List<String> classification) {
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    // toString para depuración o logging
    @Override
    public String toString() {
        return "Race{" +
                "_id='" + _id + '\'' +
                ", name='" + name + '\'' +
                ", sport='" + sport + '\'' +
                ", date=" + date +
                ", location='" + location + '\'' +
                ", distance=" + distance +
                ", maxParticipants=" + maxParticipants +
                ", unevenness=" + unevenness +
                ", tour='" + tour + '\'' +
                ", qualifyingTime='" + qualifyingTime + '\'' +
                ", classification=" + classification +
                ", createdBy='" + createdBy + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
