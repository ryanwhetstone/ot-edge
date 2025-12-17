-- Add evaluations table
CREATE TABLE IF NOT EXISTS "evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "evaluations_uuid_unique" UNIQUE("uuid")
);

-- Add foreign keys
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_evaluations_client_id" ON "evaluations" USING btree ("client_id");
CREATE INDEX IF NOT EXISTS "idx_evaluations_user_id" ON "evaluations" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_evaluations_uuid" ON "evaluations" USING btree ("uuid");
