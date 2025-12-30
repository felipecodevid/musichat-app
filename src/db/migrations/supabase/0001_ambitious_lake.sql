ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "device_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE POLICY "select own" ON "messages" AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = "messages"."user_id");--> statement-breakpoint
CREATE POLICY "insert own" ON "messages" AS PERMISSIVE FOR INSERT TO public WITH CHECK (auth.uid() = "messages"."user_id");--> statement-breakpoint
CREATE POLICY "update own" ON "messages" AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = "messages"."user_id");--> statement-breakpoint
CREATE POLICY "delete own" ON "messages" AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = "messages"."user_id");