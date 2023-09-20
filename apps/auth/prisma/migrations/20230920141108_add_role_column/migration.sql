-- CreateEnum
CREATE TYPE "Role" AS ENUM ('employer', 'candidate');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'candidate';
