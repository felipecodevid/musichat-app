// English translations
export const en = {
  // Common
  common: {
    cancel: 'Cancel',
    done: 'Done',
    back: 'Back',
    edit: 'Edit',
    delete: 'Delete',
    error: 'Error',
    albums: 'Albums',
  },

  // Home Screen
  home: {
    title: 'My Albums',
    emptyTitle: 'Your music collection awaits',
    emptySubtitle:
      'Create your first album to start organizing your favorite tracks and memories',
    createAlbum: 'Create Album',
  },

  // Album Chat List
  albumChatList: {
    title: 'Chats',
    emptyTitle: 'No chats yet',
    emptySubtitle: 'Start a new conversation',
    noMessagesYet: 'No messages yet',
    deleteChatTitle: 'Delete Chat',
    deleteChatConfirm:
      'Are you sure you want to delete "%{name}"? This action cannot be undone.',
    deleteError: 'Failed to delete chat',
  },

  // Create Album
  createAlbum: {
    title: 'New Album',
    addCoverPhoto: 'Add Cover Photo',
    albumName: 'Album Name',
    albumNamePlaceholder: 'e.g. Summer Vibes',
    description: 'Description',
    descriptionPlaceholder: "What's this album about?",
  },

  // Create Song/Chat
  createSong: {
    title: 'New Chat',
    addingTo: 'Adding to',
    album: 'Album',
    chatName: 'Chat Name',
    chatNamePlaceholder: 'e.g. Verse Ideas, Feedback Request',
    description: 'Description',
    descriptionPlaceholder: "What's this chat about?",
    errorAlbumIdMissing: 'Album ID is missing',
  },

  // Edit Song/Chat
  editSong: {
    title: 'Edit Chat',
    editingIn: 'Editing in',
    errorSongIdMissing: 'Song ID is missing',
  },

  // Chat Screen
  chat: {
    title: 'Chat',
    audioMessage: 'Audio Message',
    messagePlaceholder: 'Message...',
    swipeToCancel: 'Swipe to cancel',
  },

  // Layout / Migrations
  layout: {
    migrationError: 'Migration error:',
    runningMigrations: 'Running migrations...',
  },

  // Auth Screen
  auth: {
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    email: 'Email',
    emailPlaceholder: 'hello@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account? ",
    hasAccount: 'Already have an account? ',
    fillAllFields: 'Please fill in all fields',
    passwordsDoNotMatch: 'Passwords do not match',
    accountCreated:
      'Account created! Please check your email for verification if required, or sign in.',
    success: 'Success',
  },
} as const;

// Structural type that allows different string values for each language
export type Translations = {
  common: {
    cancel: string;
    done: string;
    back: string;
    edit: string;
    delete: string;
    error: string;
    albums: string;
  };
  home: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    createAlbum: string;
  };
  albumChatList: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    noMessagesYet: string;
    deleteChatTitle: string;
    deleteChatConfirm: string;
    deleteError: string;
  };
  createAlbum: {
    title: string;
    addCoverPhoto: string;
    albumName: string;
    albumNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
  };
  createSong: {
    title: string;
    addingTo: string;
    album: string;
    chatName: string;
    chatNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    errorAlbumIdMissing: string;
  };
  editSong: {
    title: string;
    editingIn: string;
    errorSongIdMissing: string;
  };
  chat: {
    title: string;
    audioMessage: string;
    messagePlaceholder: string;
    swipeToCancel: string;
  };
  layout: {
    migrationError: string;
    runningMigrations: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    signIn: string;
    signUp: string;
    noAccount: string;
    hasAccount: string;
    fillAllFields: string;
    passwordsDoNotMatch: string;
    accountCreated: string;
    success: string;
  };
};
