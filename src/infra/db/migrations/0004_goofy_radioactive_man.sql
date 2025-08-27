ALTER TABLE "recipes" ADD COLUMN "searchable_text" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('portuguese', "recipes"."title"), 'A') ||
          setweight(to_tsvector('portuguese', "recipes"."ingredients"), 'B')) STORED;--> statement-breakpoint
CREATE INDEX "searchable_text_idx" ON "recipes" USING gin ("searchable_text");