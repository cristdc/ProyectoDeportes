/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modelo;

import java.util.Date;

/**
 *
 * @author Marcos
 */
public class User {
    private String _id;        // Identificador único (ObjectId en la base de datos)
    private String name;       // Nombre del usuario
    private String email;      // Correo electrónico (debe ser único)
    private String password;   // Contraseña encriptada
    private String role;       // "user" o "admin"
    private int age;           // Edad del usuario
    private String gender;     // "male", "female" o "other"
    private Date registeredAt; // Fecha de registro

    // Constructor vacío (requerido por algunas librerías de serialización/deserialización)
    public User() {
    }

    // Constructor con todos los campos
    public User(String _id, String name, String email, String password, String role, int age, String gender, Date registeredAt) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.age = age;
        this.gender = gender;
        this.registeredAt = registeredAt;
    }

    // Getters y Setters

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Date registeredAt) {
        this.registeredAt = registeredAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "_id='" + _id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", registeredAt=" + registeredAt +
                '}';
    }
}
