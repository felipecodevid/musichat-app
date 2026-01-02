import type { Translations } from './en';

// Spanish translations
export const es: Translations = {
  // Common
  common: {
    cancel: 'Cancelar',
    done: 'Listo',
    back: 'Atrás',
    error: 'Error',
    albums: 'Álbumes',
  },

  // Home Screen
  home: {
    title: 'Mis Álbumes',
    emptyTitle: 'Tu colección de música te espera',
    emptySubtitle:
      'Crea tu primer álbum para empezar a organizar tus canciones y recuerdos favoritos',
    createAlbum: 'Crear Álbum',
  },

  // Album Chat List
  albumChatList: {
    title: 'Chats',
    emptyTitle: 'Aún no hay chats',
    emptySubtitle: 'Inicia una nueva conversación',
    noMessagesYet: 'Aún no hay mensajes',
  },

  // Create Album
  createAlbum: {
    title: 'Nuevo Álbum',
    addCoverPhoto: 'Agregar Foto de Portada',
    albumName: 'Nombre del Álbum',
    albumNamePlaceholder: 'ej. Vibras de Verano',
    description: 'Descripción',
    descriptionPlaceholder: '¿De qué se trata este álbum?',
  },

  // Create Song/Chat
  createSong: {
    title: 'Nuevo Chat',
    addingTo: 'Agregando a',
    album: 'Álbum',
    chatName: 'Nombre del Chat',
    chatNamePlaceholder: 'ej. Ideas para Versos, Solicitud de Feedback',
    description: 'Descripción',
    descriptionPlaceholder: '¿De qué se trata este chat?',
    errorAlbumIdMissing: 'Falta el ID del álbum',
  },

  // Chat Screen
  chat: {
    title: 'Chat',
    audioMessage: 'Mensaje de Audio',
    messagePlaceholder: 'Mensaje...',
    swipeToCancel: 'Desliza para cancelar',
  },

  // Layout / Migrations
  layout: {
    migrationError: 'Error de migración:',
    runningMigrations: 'Ejecutando migraciones...',
  },

  // Auth Screen
  auth: {
    welcomeBack: 'Bienvenido de nuevo',
    createAccount: 'Crea tu cuenta',
    email: 'Correo electrónico',
    emailPlaceholder: 'hola@ejemplo.com',
    password: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    confirmPassword: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    noAccount: '¿No tienes una cuenta? ',
    hasAccount: '¿Ya tienes una cuenta? ',
    fillAllFields: 'Por favor completa todos los campos',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    accountCreated:
      '¡Cuenta creada! Por favor revisa tu correo para verificación si es necesario, o inicia sesión.',
    success: 'Éxito',
  },
};
