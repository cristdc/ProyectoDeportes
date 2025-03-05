# nGuia detallada para trabajar con Git en el proyecto de clase

## Estructura del repositorio
El repositorio tendra las siguientes ramas principales:

- **`main`** → Version estable del proyecto (solo el organizador la modifica).
- **`staging`** → Aqui se integran los cambios de los lideres antes de pasar a `main`.
- **Ramas de cada lider:**
  - `backend`
  - `ciclismo`
  - `running`
  - `trail_running`
- **Ramas individuales de cada alumno:**
  - Cada alumno trabaja en su propia rama con el formato `develop_nombreAlumno` (Ejemplo: `develop_ana`).

## Reglas generales
💚 Cada **alumno** trabaja en su rama `develop_nombreAlumno`.  
💚 Cada **lider** fusiona las ramas de su equipo en su rama (`backend`, `ciclismo`, etc.).  
💚 Los lideres suben sus cambios a `staging`.  
💚 **Solo el lider seleccionado** mueve `staging` a `main`.  

---

## 🚀 Flujo de trabajo (paso a paso)

### 👥 Para cada alumno
#### 1️⃣ Clonar el repositorio (solo la primera vez)
```sh
git clone <URL_DEL_REPO>
cd <nombre_del_repositorio>
```

#### 2️⃣ Ver las ramas disponibles
```sh
git branch -r
```

#### 3️⃣ Crear tu propia rama a partir de la del lider
Ejemplo si perteneces al equipo de **backend**:
```sh
git checkout -b develop_tuNombre origin/backend
```
Ejemplo para Ana:
```sh
git checkout -b develop_ana origin/backend
```

#### 4️⃣ Hacer cambios en el codigo
Modifica los archivos y guarda los cambios.

#### 5️⃣ Agregar y confirmar los cambios
```sh
git add .
git commit -m "Añadida validacion de usuario en login"
```

#### 6️⃣ Subir los cambios a remoto
```sh
git push origin develop_tuNombre
```

#### 7️⃣ Notificar al lider
Avisa a tu lider para que revise tu codigo y lo fusione en su rama.

---

### 👑 Para cada lider
#### 1️⃣ Cambiar a su rama y actualizarla
Ejemplo para el lider de `backend`:
```sh
git checkout backend
git pull origin backend
```

#### 2️⃣ Fusionar las ramas de los alumnos
Ejemplo para fusionar `develop_ana` en `backend`:
```sh
git merge origin develop_ana
```

Opcion 2:
```sh
git pull origin develop_ana
```

#### 3️⃣ Subir los cambios a la rama del lider
```sh
git push origin backend
```

Luego, el lider avisa al otro líder seleccionado para subir los cambios a staging .


---

## 🎯 Caso practico
### **Escenario:**
- Carlos es del equipo `backend` y ha terminado una nueva funcion.
- Su lider, Ana, fusiona su trabajo en `backend` y lo sube a `staging`.
- El lider seleccionado revisa `staging` y lo fusiona en `main`.

### **Paso a paso:**
#### 🔹 Carlos (alumno)
```sh
git checkout -b develop_carlos origin/backend
# Hace cambios en su codigo...
git add .
git commit -m "Añadida validacion de usuario en login"
git push origin develop_carlos
```
Luego avisa a Ana.

#### 🔹 Ana (lider)
```sh
git checkout backend
git pull origin backend
git merge origin/develop_carlos
git push origin backend
```
Luego avisa al lider encargado de Staging.

#### 🔹 Encargado
```sh
git checkout staging
git pull origin staging
git merge backend
git push origin staging
```
Cuando todo este bien, lo pasa a `main`:
```sh
git checkout main
git pull origin main
git merge staging
git push origin main
```

---

## ❌ Errores comunes y soluciones
### 🔹 1️⃣ Trabaje en `backend` en lugar de mi rama
```sh
git stash
git checkout -b develop_tuNombre origin/backend
git stash pop
git add .
git commit -m "Recuperado trabajo desde backend"
git push origin develop_tuNombre
```

### 🔹 2️⃣ No puedo hacer `git push`
```sh
git pull origin develop_tuNombre --rebase
git push origin develop_tuNombre
```

### 🔹 3️⃣ Hay conflictos al fusionar ramas
- Edita los archivos en conflicto y elimina las marcas `<<<<<<<`, `=======`, `>>>>>>>`.
- Luego confirma los cambios:
```sh
git add .
git commit -m "Conflictos resueltos"
git push origin tuRama
```

---

## 🚀 **Resumen**
1️⃣ **Cada alumno trabaja en su propia rama `develop_nombreAlumno`**.  
2️⃣ **Suben los cambios a la rama de su lider (`backend`, `ciclismo`, etc.).**  
3️⃣ **Los lideres fusionan sus cambios y los suben a `staging`**.  
4️⃣ **El organizador revisa `staging` y lo fusiona en `main`**.  
5️⃣ **Siempre hacer `git pull` antes de trabajar**.  

📉 **Con esta guia, evitaremos confusiones y mantendremos un flujo de trabajo ordenado en Git. 🚀🔥**

