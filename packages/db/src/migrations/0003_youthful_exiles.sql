CREATE TABLE IF NOT EXISTS "histories" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"action" varchar(50) NOT NULL,
	"metadata" jsonb NOT NULL,
	"contents" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "histories" ADD CONSTRAINT "histories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_histories_user_id_action" ON "histories" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_histories_user_id_action_metadata_part" ON "histories" USING btree ("user_id","action",("metadata"->>'part'));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_histories_metadata_gin" ON "histories" USING gin ("metadata");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_histories_created_at" ON "histories" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_histories_user_id_created_at" ON "histories" USING btree ("user_id","created_at");