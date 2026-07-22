/*
  Warnings:

  - You are about to drop the column `lestName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lestName",
ADD COLUMN     "lastName" TEXT;
