// English translations
export const en = {
  // Common
  common: {
    cancel: 'Cancel',
    done: 'Done',
    back: 'Back',
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
} as const;

// Structural type that allows different string values for each language
export type Translations = {
  common: {
    cancel: string;
    done: string;
    back: string;
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
};
