/*
  Warnings:

  - You are about to drop the column `notes` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `applications` table. All the data in the column will be lost.
  - Added the required column `email` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."applications" DROP CONSTRAINT "applications_userId_fkey";

-- DropIndex
DROP INDEX "public"."applications_userId_scholarshipId_key";

-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "notes",
DROP COLUMN "userId",
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "awards" TEXT,
ADD COLUMN     "currentInstitution" TEXT,
ADD COLUMN     "currentYear" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expectedGraduation" TIMESTAMP(3),
ADD COLUMN     "extracurricular" TEXT,
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "financialNeed" TEXT,
ADD COLUMN     "futureGoals" TEXT,
ADD COLUMN     "gpa" DOUBLE PRECISION,
ADD COLUMN     "intendedCountry" TEXT,
ADD COLUMN     "intendedProgram" TEXT,
ADD COLUMN     "intendedUniversity" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "motivation" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "publications" TEXT,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "researchExperience" TEXT,
ADD COLUMN     "workExperience" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
