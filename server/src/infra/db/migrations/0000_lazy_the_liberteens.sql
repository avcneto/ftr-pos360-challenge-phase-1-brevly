CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"access_count" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
