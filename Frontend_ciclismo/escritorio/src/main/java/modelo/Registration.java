
package modelo;

import java.util.Date;
import java.util.List;

public class Registration {
    private String _id;          // Identificador único (ObjectId en la BD)
    private String userId;       // ID del usuario (ObjectId en la BD)
    private String raceId;       // ID de la carrera (ObjectId en la BD)
    private int dorsal;          // Número del corredor en la carrera
    private Date registeredAt;   // Fecha y hora de la inscripción
    private String status;       // "registered", "cancelled", "finished"
    private String time;         // Tiempo registrado en la carrera (si finaliza)
    private int position;        // Posición final en la carrera (si aplica)
    private List<String> awards; // Lista de premios obtenidos

    // Constructor vacío
    public Registration() {
    }

    // Constructor con todos los campos
    public Registration(String _id, String userId, String raceId, int dorsal, Date registeredAt,
                       String status, String time, int position, List<String> awards) {
        this._id = _id;
        this.userId = userId;
        this.raceId = raceId;
        this.dorsal = dorsal;
        this.registeredAt = registeredAt;
        this.status = status;
        this.time = time;
        this.position = position;
        this.awards = awards;
    }

    // Getters y Setters

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRaceId() {
        return raceId;
    }

    public void setRaceId(String raceId) {
        this.raceId = raceId;
    }

    public int getDorsal() {
        return dorsal;
    }

    public void setDorsal(int dorsal) {
        this.dorsal = dorsal;
    }

    public Date getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Date registeredAt) {
        this.registeredAt = registeredAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public List<String> getAwards() {
        return awards;
    }

    public void setAwards(List<String> awards) {
        this.awards = awards;
    }

    @Override
    public String toString() {
        return "Inscription{" +
                "_id='" + _id + '\'' +
                ", userId='" + userId + '\'' +
                ", raceId='" + raceId + '\'' +
                ", dorsal=" + dorsal +
                ", registeredAt=" + registeredAt +
                ", status='" + status + '\'' +
                ", time='" + time + '\'' +
                ", position=" + position +
                ", awards=" + awards +
                '}';
    }
}
