CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"birth_date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "clients_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "evaluations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "spm2_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"assessment_date" timestamp DEFAULT now(),
	"responses" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "spm2_assessments_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spm2_assessments" ADD CONSTRAINT "spm2_assessments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spm2_assessments" ADD CONSTRAINT "spm2_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_clients_user_id" ON "clients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_clients_uuid" ON "clients" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "idx_evaluations_client_id" ON "evaluations" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_evaluations_user_id" ON "evaluations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_evaluations_uuid" ON "evaluations" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "idx_spm2_client_id" ON "spm2_assessments" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_spm2_user_id" ON "spm2_assessments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_spm2_uuid" ON "spm2_assessments" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");