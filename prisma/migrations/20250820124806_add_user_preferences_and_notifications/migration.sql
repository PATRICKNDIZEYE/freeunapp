-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "degreeLevel" TEXT,
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "notificationPreferences" JSONB;
