ALTER TABLE "grammar_exercises" ALTER COLUMN "options" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar_exercises" ALTER COLUMN "correct_index" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar_exercises" ADD COLUMN "exercise_kind" text DEFAULT 'mcq4' NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar_exercises" ADD COLUMN "fill_answer" text;--> statement-breakpoint
ALTER TABLE "grammar_exercises" ADD COLUMN "hint_keyword" text;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "lesson_html" text;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "exercise_type_name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "exercise_type_des" text DEFAULT '' NOT NULL;