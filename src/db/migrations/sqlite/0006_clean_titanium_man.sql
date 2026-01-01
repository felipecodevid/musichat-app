ALTER TABLE `messages` ADD `type` text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` ADD `media_uri` text;