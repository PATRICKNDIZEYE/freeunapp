-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."AmountType" AS ENUM ('FULL', 'PARTIAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('COMPUTER_SCIENCE', 'ENGINEERING', 'MEDICINE', 'BUSINESS', 'ARTS', 'SOCIAL_SCIENCES', 'NATURAL_SCIENCES', 'MATHEMATICS', 'LAW', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'PHD', 'CERTIFICATE', 'DIPLOMA');

-- CreateEnum
CREATE TYPE "public"."ScholarshipStatus" AS ENUM ('ACTIVE', 'DRAFT', 'EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('DEADLINE_REMINDER', 'NEW_SCHOLARSHIP', 'APPLICATION_UPDATE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('GUIDE', 'ESSAY_EXAMPLE', 'APPLICATION_TIP', 'OTHER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'STUDENT',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scholarships" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detailedDescription" TEXT,
    "logoUrl" TEXT,
    "referenceUrl" TEXT,
    "eligibilityCriteria" TEXT,
    "applicationProcess" TEXT,
    "qualificationBasis" TEXT,
    "awardsAvailable" INTEGER,
    "amount" TEXT NOT NULL,
    "amountType" "public"."AmountType" NOT NULL DEFAULT 'PARTIAL',
    "category" "public"."Category" NOT NULL,
    "degreeLevel" "public"."DegreeLevel" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "contactInfo" TEXT,
    "status" "public"."ScholarshipStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvalStatus" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "views" INTEGER NOT NULL DEFAULT 0,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saved_scholarships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "notes" TEXT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "type" "public"."ResourceType" NOT NULL,
    "category" "public"."Category" NOT NULL,
    "description" TEXT,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "saved_scholarships_userId_scholarshipId_key" ON "public"."saved_scholarships"("userId", "scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_scholarshipId_key" ON "public"."applications"("userId", "scholarshipId");

-- AddForeignKey
ALTER TABLE "public"."scholarships" ADD CONSTRAINT "scholarships_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_scholarships" ADD CONSTRAINT "saved_scholarships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_scholarships" ADD CONSTRAINT "saved_scholarships_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "public"."scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "public"."scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
