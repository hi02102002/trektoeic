ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "title_vi" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "part" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sections_part" ON "sections" USING btree ("part");