/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'OWNER', 'STAFF');

-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'OWNER';
