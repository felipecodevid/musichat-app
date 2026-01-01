CREATE TABLE "albums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "albums" ADD COLUMN "user_id" uuid NOT NULL;
--> statement-breakpoint
ALTER TABLE "albums" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "select own" ON "albums" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "insert own" ON "albums" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "update own" ON "albums" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "delete own" ON "albums" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.uid() = user_id);