-- CreateEnum
CREATE TYPE "rolesEnum" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "rolesEnum" NOT NULL DEFAULT 'MEMBER';
