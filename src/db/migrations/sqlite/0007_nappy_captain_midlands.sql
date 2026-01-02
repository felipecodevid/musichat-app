PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new__meta` (
	`user_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text,
	PRIMARY KEY(`user_id`, `key`)
);
--> statement-breakpoint
INSERT INTO `__new__meta`("user_id", "key", "value") SELECT "user_id", "key", "value" FROM `_meta`;--> statement-breakpoint
DROP TABLE `_meta`;--> statement-breakpoint
ALTER TABLE `__new__meta` RENAME TO `_meta`;--> statement-breakpoint
PRAGMA foreign_keys=ON;