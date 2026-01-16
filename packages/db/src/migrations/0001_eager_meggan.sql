DROP INDEX IF EXISTS "verification_identifier_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "account_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "session_userId_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "vocabulary_categories" DROP COLUMN IF EXISTS "url";--> statement-breakpoint
ALTER TABLE "vocabularies" DROP COLUMN IF EXISTS "word_class";