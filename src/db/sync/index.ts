import NetInfo from "@react-native-community/netinfo";
import { pullChanges } from "./pull";
import { pushChanges } from "./push";

export async function syncAll(userId: string) {
  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  await pushChanges(userId);
  await pullChanges(userId);
}
