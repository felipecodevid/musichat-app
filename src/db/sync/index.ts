import NetInfo from "@react-native-community/netinfo";
import { pushMessages } from "./messages/push";
import { pullMessages } from "./messages/pull";
import { pushAlbums } from "./albums/push";
import { pullAlbums } from "./albums/pull";
import { pushSongs } from "./songs/push";
import { pullSongs } from "./songs/pull";

export async function syncAll(userId: string) {
  const net = await NetInfo.fetch();
  if (!net.isConnected || !userId) return;

  // Push all local changes to Supabase
  await pushMessages(userId);
  await pushAlbums(userId);
  await pushSongs(userId);

  // Pull remote changes from Supabase
  await pullMessages(userId);
  await pullAlbums(userId);
  await pullSongs(userId);
}

// Re-export individual sync functions for granular control
export { pushMessages } from "./messages/push";
export { pullMessages } from "./messages/pull";
export { pushAlbums } from "./albums/push";
export { pullAlbums } from "./albums/pull";
export { pushSongs } from "./songs/push";
export { pullSongs } from "./songs/pull";
