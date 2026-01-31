-- Set vocabularies.collection to object (Youdao uk/us) where it is stored as array (e.g. []).
-- Uses name (lowercase) for audio: https://dict.youdao.com/dictvoice?audio=word&type=1|2
-- Run: psql $DATABASE_URL -f packages/db/scripts/update-vocabularies-collection-array-to-null.sql

UPDATE vocabularies
SET collection = jsonb_build_object(
  'uk', jsonb_build_object(
    'spell', lower(trim(name)),
    'sound', 'https://dict.youdao.com/dictvoice?audio=' || replace(replace(lower(trim(name)), ' ', '%20'), '''', '%27') || '&type=1'
  ),
  'us', jsonb_build_object(
    'spell', lower(trim(name)),
    'sound', 'https://dict.youdao.com/dictvoice?audio=' || replace(replace(lower(trim(name)), ' ', '%20'), '''', '%27') || '&type=2'
  )
)
WHERE jsonb_typeof(collection) = 'array';
