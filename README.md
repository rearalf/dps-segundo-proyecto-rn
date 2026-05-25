# ComuniVentos 📅

Aplicación móvil para la gestión y participación en eventos comunitarios, desarrollada con React Native y Expo.

## Equipo de desarrollo

- rearalf — Ricardo Recinos
- nmendez0698 — Neris Mendez
- MB503DatIA - Miguel Barahona

---

## Requisitos de la aplicación

### 1. Autenticación
- Registro y acceso mediante usuario y contraseña
- Selección de rol: Organizador o Participante

### 2. Gestión de Eventos
- Crear, actualizar y eliminar eventos con fecha, hora, ubicación y descripción
- Ver eventos próximos y pasados
- Confirmar o cancelar asistencia a eventos
- Contador de personas confirmadas por evento

### 3. Interacción Social
- Comentarios y calificaciones por estrellas ligados a eventos específicos
- Solo pueden comentar usuarios que confirmaron asistencia
- Visualización de opiniones de la comunidad con nombre del evento

### 4. Historial y Estadísticas
- Registro de eventos pasados a los que asistió el usuario
- Estadísticas reales: total de eventos, eventos asistidos y comentarios

---

## Mockups / Diseño UX-UI

### Login y Registro
![Login](mockups/login.png)
![Registro](mockups/registro.png)

### Gestión de Eventos
![Crear Evento](mockups/crear-evento.png)
![Eventos Próximos](mockups/eventos-proximos.png)

### Comunidad e Historial
![Comunidad](mockups/comunidad.png)
![Historial](mockups/historial.png)

---

## Instalación y ejecución

1. Clonar el repositorio
```bash
   git clone https://github.com/rearalf/dps-segundo-proyecto-rn.git
   cd dps-segundo-proyecto-rn
```

2. Instalar dependencias
```bash
   npm install --legacy-peer-deps
```

3. Iniciar la app
```bash
   npx expo start --lan --clear
```

4. Escanear el QR con **Expo Go SDK 55** desde tu celular

---

## Tecnologías utilizadas

- React Native + Expo SDK 55
- Expo Router (navegación)
- Firebase Firestore (base de datos en tiempo real)
- Firebase Auth (autenticación)
- Zustand (manejo de estado)
- TypeScript

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── events.tsx      # Gestión y asistencia a eventos
│   │   ├── community.tsx   # Comentarios y calificaciones
│   │   ├── history.tsx     # Historial y estadísticas
│   │   └── _layout.tsx
│   ├── signin.tsx
│   ├── signup.tsx
│   └── _layout.tsx
├── components/
├── constants/
├── hooks/
├── interfaces/
├── services/
└── store/
```
