ALTER TABLE "questions_to_tags" DROP CONSTRAINT "questions_to_tags_question_id_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "questions_to_tags" ADD CONSTRAINT "questions_to_tags_question_id_sub_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."sub_questions"("id") ON DELETE cascade ON UPDATE no action;