CREATE TABLE "deck_of_users" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deck_of_users" ADD CONSTRAINT "deck_of_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "deck_of_user_user_id_category_id_unique" ON "deck_of_users" USING btree ("user_id","category_id");