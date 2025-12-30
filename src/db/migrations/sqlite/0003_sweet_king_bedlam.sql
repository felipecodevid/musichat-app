CREATE TABLE `_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `_outbox` (
	`op_id` text PRIMARY KEY NOT NULL,
	`table` text NOT NULL,
	`type` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `messages` ADD `device_id` text NOT NULL;