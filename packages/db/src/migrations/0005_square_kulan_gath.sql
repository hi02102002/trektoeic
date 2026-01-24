CREATE TABLE "questions_to_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"question_id" text NOT NULL,
	"tag_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"key" text NOT NULL,
	"group_key" text NOT NULL,
	"part" integer,
	"label_vi" text NOT NULL,
	"label_en" text,
	CONSTRAINT "tags_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "questions_to_tags" ADD CONSTRAINT "questions_to_tags_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions_to_tags" ADD CONSTRAINT "questions_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_to_tags_question_id_idx" ON "questions_to_tags" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "questions_to_tags_tag_id_idx" ON "questions_to_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "questions_to_tags_question_id_tag_id_idx" ON "questions_to_tags" USING btree ("question_id","tag_id");--> statement-breakpoint
CREATE INDEX "tags_group_key_idx" ON "tags" USING btree ("group_key");--> statement-breakpoint
CREATE INDEX "tags_key_idx" ON "tags" USING btree ("key");--> statement-breakpoint
CREATE INDEX "histories_user_action_metadata_kit_id_idx" ON "histories" USING btree ("user_id","action",("metadata"->>'kitId'));