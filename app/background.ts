// app/background.ts
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { syncAll } from "../src/db/sync";
import { supabase } from "../src/db/client/supabase";

const BACKGROUND_SYNC_TASK = "BACKGROUND_SYNC_TASK";

// Define the task in global scope (required by expo-task-manager)
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log(`[BackgroundSync] Task started at: ${new Date().toISOString()}`);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.log("[BackgroundSync] No authenticated user, skipping sync");
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    console.log("[BackgroundSync] Syncing data...");
    await syncAll(userId);
    console.log("[BackgroundSync] Sync completed successfully");

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("[BackgroundSync] Task failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/**
 * Registers the background sync task.
 * Note: minimumInterval is in MINUTES (minimum 15 min).
 * The system controls actual execution timing to optimize battery.
 * Silently skips registration if background tasks aren't available (e.g., Expo Go).
 */
export async function registerBackgroundSync() {
  try {
    // Check if background tasks are available (won't be in Expo Go)
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.warn("[BackgroundSync] Background tasks not available (running in Expo Go?)");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

    if (isRegistered) {
      console.log("[BackgroundSync] Task already registered");
      return;
    }

    await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15, // 15 minutes (minimum allowed)
    });

    console.log("[BackgroundSync] Task registered successfully");
  } catch (error) {
    // Silently handle - background sync is a nice-to-have, not critical
    console.warn("[BackgroundSync] Could not register task (this is expected in Expo Go):", error);
  }
}

/**
 * Unregisters the background sync task.
 */
export async function unregisterBackgroundSync() {
  try {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    console.log("[BackgroundSync] Task unregistered");
  } catch (error) {
    console.error("[BackgroundSync] Failed to unregister task:", error);
  }
}

/**
 * Gets the current status of background task availability.
 */
export async function getBackgroundTaskStatus() {
  return BackgroundTask.getStatusAsync();
}

/**
 * Triggers the background task for testing (only works in development mode).
 */
export async function triggerBackgroundSyncForTesting() {
  try {
    console.log("[BackgroundSync] Triggering task for testing...");
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
    console.log("[BackgroundSync] Test trigger completed");
  } catch (error) {
    console.error("[BackgroundSync] Test trigger failed:", error);
  }
}

// Re-export the task name for use elsewhere
export { BACKGROUND_SYNC_TASK };
