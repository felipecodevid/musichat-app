// app/background.ts
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { syncAll } from "../src/db/sync";

const TASK_NAME = "SYNC_TASK";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // TODO: read from auth
    const userId = "";
    if (userId) await syncAll(userId);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default async function registerBackgroundSync() {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 15 * 60, // 15 min
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
