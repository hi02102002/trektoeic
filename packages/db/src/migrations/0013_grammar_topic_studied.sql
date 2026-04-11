CREATE TABLE "grammar_topic_studied" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"studied_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grammar_topic_studied_user_topic_unique" UNIQUE("user_id","topic_id")
);
--> statement-breakpoint
ALTER TABLE "grammar_topic_studied" ADD CONSTRAINT "grammar_topic_studied_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_topic_studied" ADD CONSTRAINT "grammar_topic_studied_topic_id_grammar_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "grammar_topic_studied_user_id_idx" ON "grammar_topic_studied" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "grammar_topic_studied_topic_id_idx" ON "grammar_topic_studied" USING btree ("topic_id");