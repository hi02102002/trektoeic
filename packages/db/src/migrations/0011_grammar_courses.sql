CREATE TABLE "grammar_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"topic_id" text NOT NULL,
	"exercise_key" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"topic_id" text NOT NULL,
	"heading" text NOT NULL,
	"body" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"course_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"related_parts" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "grammar_exercises" ADD CONSTRAINT "grammar_exercises_topic_id_grammar_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_sections" ADD CONSTRAINT "grammar_sections_topic_id_grammar_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD CONSTRAINT "grammar_topics_course_id_grammar_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."grammar_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_courses_slug_unique" ON "grammar_courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "grammar_exercises_topic_id_idx" ON "grammar_exercises" USING btree ("topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_exercises_topic_exercise_key_unique" ON "grammar_exercises" USING btree ("topic_id","exercise_key");--> statement-breakpoint
CREATE INDEX "grammar_sections_topic_id_idx" ON "grammar_sections" USING btree ("topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_topics_slug_unique" ON "grammar_topics" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "grammar_topics_course_id_idx" ON "grammar_topics" USING btree ("course_id");