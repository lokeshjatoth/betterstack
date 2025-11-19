/*
  Warnings:

  - You are about to drop the `websiteTick` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "website_status" AS ENUM ('up', 'Down', 'Unknown');

-- DropForeignKey
ALTER TABLE "websiteTick" DROP CONSTRAINT "websiteTick_region_id_fkey";

-- DropForeignKey
ALTER TABLE "websiteTick" DROP CONSTRAINT "websiteTick_website_id_fkey";

-- DropTable
DROP TABLE "websiteTick";

-- DropEnum
DROP TYPE "websiteStatus";

-- CreateTable
CREATE TABLE "website_tick" (
    "id" TEXT NOT NULL,
    "response_time_ms" INTEGER NOT NULL,
    "status" "website_status" NOT NULL,
    "region_id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_tick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "website_tick" ADD CONSTRAINT "website_tick_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_tick" ADD CONSTRAINT "website_tick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
