-- Move vocabularies from child categories to their root categories.
UPDATE "vocabularies" AS v
SET "category_id" = c."parent_id"
FROM "vocabulary_categories" AS c
WHERE v."category_id" = c."id"
  AND c."parent_id" IS NOT NULL;
--> statement-breakpoint

-- Remove all child categories after reassignment.
DELETE FROM "vocabulary_categories"
WHERE "parent_id" IS NOT NULL;
--> statement-breakpoint

-- Normalize remaining categories as root categories only.
UPDATE "vocabulary_categories"
SET "parent_id" = NULL,
    "level" = 1,
    "has_child" = false;
