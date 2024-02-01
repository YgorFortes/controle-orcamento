/*
  Warnings:

  - Made the column `categoria` on table `despesas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "despesas" ALTER COLUMN "categoria" SET NOT NULL;
