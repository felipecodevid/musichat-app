CREATE TABLE `albums` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`tags` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`user_id` text NOT NULL,
	`device_id` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
DROP TABLE `users`;