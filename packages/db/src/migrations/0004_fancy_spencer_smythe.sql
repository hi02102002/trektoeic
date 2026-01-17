DROP INDEX "idx_histories_user_id_action";--> statement-breakpoint
DROP INDEX "idx_histories_user_id_action_metadata_part";--> statement-breakpoint
DROP INDEX "idx_histories_metadata_gin";--> statement-breakpoint
DROP INDEX "idx_histories_created_at";--> statement-breakpoint
DROP INDEX "idx_histories_user_id_created_at";--> statement-breakpoint
DROP INDEX "idx_sections_part";--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "action" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "contents" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "kits" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "kits" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "kits" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "kits" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "kits" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "position" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "kit_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "question_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "options" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "ans" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_questions" ALTER COLUMN "translation" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "intro_audio" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "intro_image" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "intro_answer" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "toeic_max_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "toeic_max_tokens" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "toeic_max_tokens" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "toeic_max_tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "toeic_max_tokens" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabularies" ALTER COLUMN "category_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabulary_categories" ALTER COLUMN "parent_id" SET DATA TYPE text;--> statement-breakpoint
CREATE INDEX "histories_user_id_action_idx" ON "histories" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX "histories_user_id_created_at_idx" ON "histories" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "histories_user_action_metadata_part_idx" ON "histories" USING btree ("user_id","action",("metadata"->>'part'));--> statement-breakpoint
CREATE INDEX "histories_metadata_gin_idx" ON "histories" USING gin ("metadata");--> statement-breakpoint
CREATE INDEX "kits_year_idx" ON "kits" USING btree ("year");--> statement-breakpoint
CREATE INDEX "questions_kit_id_idx" ON "questions" USING btree ("kit_id");--> statement-breakpoint
CREATE INDEX "questions_kit_id_part_idx" ON "questions" USING btree ("kit_id","part");--> statement-breakpoint
CREATE INDEX "questions_part_idx" ON "questions" USING btree ("part");--> statement-breakpoint
CREATE INDEX "sub_questions_question_id_idx" ON "sub_questions" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "sub_questions_question_id_position_idx" ON "sub_questions" USING btree ("question_id","position");--> statement-breakpoint
CREATE INDEX "sections_part_idx" ON "sections" USING btree ("part");--> statement-breakpoint
CREATE INDEX "vocabularies_category_id_idx" ON "vocabularies" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "vocabularies_name_idx" ON "vocabularies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "vocabulary_categories_parent_id_idx" ON "vocabulary_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "vocabulary_categories_level_idx" ON "vocabulary_categories" USING btree ("level");