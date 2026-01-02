CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`device_id` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
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
