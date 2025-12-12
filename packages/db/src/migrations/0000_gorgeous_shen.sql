-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "toeic_max_tokens" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"token" text DEFAULT 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDE2MzMsIm5hbWUiOiJIb2FuZyBIdXkiLCJwaG9uZSI6IjAzOTQ2MDQ4MzEiLCJub2lzZSI6IjY4NTY2MTY4ODVjMjEiLCJhY3RpdmUiOjEsInZlcmlmeV9waG9uZSI6MCwiZW1haWwiOiJob2FuZ2h1eXZvZGV2QGdtYWlsLmNvbSIsInNlY3Jlc3RfY29kZSI6MCwiZXhwaXJlc19zZWNyZXN0X2NvZGUiOm51bGwsImFjdGl2YXRpb25fY29kZSI6bnVsbCwiZGF0ZV9leHBpcmVzIjpudWxsLCJwYWNrYWdlIjowLCJwYWNrYWdlX2V4cGlyZXMiOiIyMDI1LTA2LTI0IDE0OjM4OjE2IiwiaXNfYWZmaWxpYXRlIjowLCJtYXhfcGVyY2VudCI6MCwic2NvcmUiOjAsImRldmljZSI6IkRlc2t0b3AiLCJyZWZfaWQiOjAsImxhbmciOiJ2biIsImNvbW11bml0eV9wb2ludHMiOjAsImNvbW11bml0eV9yYW5rIjpudWxsfQ.HEZZ4FXgKzuQlS74QaRL7ypZAe3V5U2fd2lkYQhn52E' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_questions" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"question_id" varchar(21) NOT NULL,
	"position" integer NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"ans" varchar NOT NULL,
	"translation" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kits" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"year" integer NOT NULL,
	CONSTRAINT "kits_name_unique" UNIQUE("name"),
	CONSTRAINT "kits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"question" text DEFAULT '',
	"title" text DEFAULT '',
	"section_title" text DEFAULT '',
	"section_des" text DEFAULT '',
	"intro" text DEFAULT '',
	"intro_vi" text DEFAULT '',
	"intro_audio" text DEFAULT '',
	"intro_image" text DEFAULT '',
	"intro_answer" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"part" integer NOT NULL,
	"position" varchar(10) NOT NULL,
	"audio_url" text,
	"image_url" text,
	"teaser" jsonb DEFAULT '{"text":"","tran":{"vi":""}}'::jsonb,
	"count" integer DEFAULT 1 NOT NULL,
	"kit_id" varchar(21) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_categories" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"alias" text,
	"url" text,
	"level" integer DEFAULT 1 NOT NULL,
	"parent_id" varchar,
	"has_child" boolean DEFAULT false NOT NULL,
	CONSTRAINT "vocabulary_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "vocabularies" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"category_id" varchar NOT NULL,
	"name" text,
	"example" text,
	"meaning" text,
	"spelling" text,
	"type" text,
	"detail_type" text,
	"word_class" text,
	"image" text,
	"collection" jsonb
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_questions" ADD CONSTRAINT "sub_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_kit_id_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_category_id_vocabulary_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."vocabulary_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier" text_ops);--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id" text_ops);
*/