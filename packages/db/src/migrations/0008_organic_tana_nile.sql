CREATE TABLE "vocabulary_review_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"vocabulary_id" text NOT NULL,
	"state" text DEFAULT 'new' NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"ease_factor" integer DEFAULT 250 NOT NULL,
	"next_review_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp with time zone,
	CONSTRAINT "vocabulary_review_cards_user_vocab_unique" UNIQUE("user_id","vocabulary_id")
);
--> statement-breakpoint
CREATE TABLE "vocabulary_review_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"vocabulary_id" text NOT NULL,
	"review_card_id" text,
	"grade" text NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"state_before" text NOT NULL,
	"state_after" text NOT NULL,
	"interval_before_days" integer,
	"interval_after_days" integer NOT NULL,
	"ease_before" integer,
	"ease_after" integer NOT NULL,
	"next_review_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocabulary_review_cards" ADD CONSTRAINT "vocabulary_review_cards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_review_cards" ADD CONSTRAINT "vocabulary_review_cards_vocabulary_id_vocabularies_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabularies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_review_logs" ADD CONSTRAINT "vocabulary_review_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_review_logs" ADD CONSTRAINT "vocabulary_review_logs_vocabulary_id_vocabularies_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabularies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_review_logs" ADD CONSTRAINT "vocabulary_review_logs_review_card_id_vocabulary_review_cards_id_fk" FOREIGN KEY ("review_card_id") REFERENCES "public"."vocabulary_review_cards"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vocabulary_review_cards_user_id_next_review_at_idx" ON "vocabulary_review_cards" USING btree ("user_id","next_review_at");--> statement-breakpoint
CREATE INDEX "vocabulary_review_cards_user_id_state_idx" ON "vocabulary_review_cards" USING btree ("user_id","state");--> statement-breakpoint
CREATE INDEX "vocabulary_review_cards_vocabulary_id_idx" ON "vocabulary_review_cards" USING btree ("vocabulary_id");--> statement-breakpoint
CREATE INDEX "vocabulary_review_logs_user_id_reviewed_at_idx" ON "vocabulary_review_logs" USING btree ("user_id","reviewed_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "vocabulary_review_logs_user_id_vocabulary_id_reviewed_at_idx" ON "vocabulary_review_logs" USING btree ("user_id","vocabulary_id","reviewed_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "vocabulary_review_logs_review_card_id_idx" ON "vocabulary_review_logs" USING btree ("review_card_id");