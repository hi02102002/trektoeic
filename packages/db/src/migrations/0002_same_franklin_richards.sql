ALTER TABLE "sections" ADD COLUMN "title_vi" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "part" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_sections_part" ON "sections" USING btree ("part");