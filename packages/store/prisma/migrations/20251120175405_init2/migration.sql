/*
  Warnings:

  - The values [up] on the enum `website_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "website_status_new" AS ENUM ('Up', 'Down', 'Unknown');
ALTER TABLE "website_tick" ALTER COLUMN "status" TYPE "website_status_new" USING ("status"::text::"website_status_new");
ALTER TYPE "website_status" RENAME TO "website_status_old";
ALTER TYPE "website_status_new" RENAME TO "website_status";
DROP TYPE "public"."website_status_old";
COMMIT;
