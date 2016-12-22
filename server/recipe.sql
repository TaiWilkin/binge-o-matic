-- TODO: update to current table structure

CREATE TABLE IF NOT EXISTS "public"."movies" (
    "id" serial NOT NULL,
    "title" text,
    "release_date" text,
    "poster_url" text,
    "blurb" text,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);

CREATE TABLE IF NOT EXISTS "public"."List_Items" (
    "id" serial NOT NULL,
    "name" text NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);
