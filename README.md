# ComuniVentos 🗓️🎊

Aplicación móvil para la gestión y participación en eventos comunitarios, desarrollada con React Native y Expo.

## Características

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

## Colaboradores

Diseño y Programación de Software multiplataforma DPS941:

- Ricardo Ernesto Alfaro Recinos AR180405
- Neris Moisés Méndez Díaz MD161918
- Miguel Ángel Barahona García BG191322

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

---

## Licenciamiento

La aplicación implementa la licencia Creative Commons CC BY 4.0 para el contenido compartido dentro de la plataforma, incluyendo publicaciones, comentarios y descripciones de eventos. Los usuarios pueden compartir contenido manteniendo la atribución correspondiente según la licencia.

---

## Enlaces relevantes

- Enlace a Mockups: https://udbedu-my.sharepoint.com/:b:/g/personal/bg191322_alumno_udb_edu_sv/IQB_Kbn86ZdBSZqklbVFDFVYAQFmRbRHv_JwnAqTPAL5vPM?e=gvgNcH
