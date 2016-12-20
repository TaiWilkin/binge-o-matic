CREATE TABLE IF NOT EXISTS "public"."movies" (
    "id" serial NOT NULL,
    "title" text,
    "release_date" text,
    "poster_url" text,
    "blurb" text,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);
