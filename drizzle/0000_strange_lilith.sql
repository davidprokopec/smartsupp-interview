create or replace function on_row_update_set_updated_at() returns trigger
    language plpgsql as
$$
begin
    NEW."updated_at" = now();
    return NEW;
end;
$$;
--> statement-breakpoint
create or replace function on_create_table_add_trigger_on_row_update_set_updated_at() returns event_trigger
    language plpgsql as
$$
declare
    obj      record;
    tbl_name text;
begin
    for obj in select * from pg_event_trigger_ddl_commands() where object_type = 'table'
        loop
            tbl_name := obj.objid::regclass;
            if exists(select 1
                      from information_schema.columns
                      where table_schema = obj.schema_name
                        and table_name = tbl_name
                        and column_name = 'updated_at') then
                execute format(
                        'create or replace trigger on_row_update_set_updated_at before update on %I for each row execute procedure on_row_update_set_updated_at();',
                        tbl_name);
            end if;
        end loop;

end
$$;
--> statement-breakpoint
create event trigger
    on_create_table_add_trigger_on_row_update_set_updated_at on ddl_command_end
    when tag in ('CREATE TABLE', 'CREATE TABLE AS')
execute procedure on_create_table_add_trigger_on_row_update_set_updated_at();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"agent_id" integer NOT NULL,
	"expected_time_done" timestamp NOT NULL,
	"overdue" boolean DEFAULT false NOT NULL,
	"done_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
