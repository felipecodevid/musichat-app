ALTER POLICY "select own" ON "messages" TO authenticated USING (auth.uid() = user_id);--> statement-breakpoint
ALTER POLICY "insert own" ON "messages" TO authenticated WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
ALTER POLICY "update own" ON "messages" TO authenticated USING (auth.uid() = user_id);--> statement-breakpoint
ALTER POLICY "delete own" ON "messages" TO authenticated USING (auth.uid() = user_id);