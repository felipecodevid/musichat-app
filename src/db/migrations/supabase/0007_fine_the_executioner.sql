ALTER TABLE "albums" ADD COLUMN "device_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "deleted_at" timestamp;