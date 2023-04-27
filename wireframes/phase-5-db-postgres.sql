CREATE TABLE "projects" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "title" string,
  "team_id" integer
);

CREATE TABLE "project_members" (
  "id" integer PRIMARY KEY,
  "project_id" integer,
  "user_id" integer,
  "user_role" string
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "role" varchar
);

CREATE TABLE "teams" (
  "id" integer PRIMARY KEY,
  "name" string,
  "company" string,
  "user_id" integer
);

CREATE TABLE "team_members" (
  "id" integer PRIMARY KEY,
  "team_id" integer,
  "user_id" integer,
  "user_role" string
);

CREATE TABLE "todos" (
  "id" integer PRIMARY KEY,
  "title" string,
  "body" text,
  "user_id" integer,
  "project_id" integer,
  "completed" bool,
  "due_date" datetime
);

CREATE TABLE "messages" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "project_id" integer,
  "date_posted" datetime
);

COMMENT ON COLUMN "projects"."user_id" IS 'creator id';

COMMENT ON COLUMN "teams"."user_id" IS 'team lead id';

COMMENT ON COLUMN "todos"."body" IS 'Content of the post';

COMMENT ON TABLE "messages" IS 'Only for message stretch goal';

ALTER TABLE "projects" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "projects" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "project_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "project_members" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "team_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "team_members" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
