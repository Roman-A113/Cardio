/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorAccreditation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorEducation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DoctorToMedicalService` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StaffType" AS ENUM ('DOCTOR', 'NURSE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('MAIN', 'PART_TIME');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorAccreditation" DROP CONSTRAINT "DoctorAccreditation_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorEducation" DROP CONSTRAINT "DoctorEducation_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSchedule" DROP CONSTRAINT "DoctorSchedule_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalService" DROP CONSTRAINT "MedicalService_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToMedicalService" DROP CONSTRAINT "_DoctorToMedicalService_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToMedicalService" DROP CONSTRAINT "_DoctorToMedicalService_B_fkey";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "ContentPage";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "DoctorAccreditation";

-- DropTable
DROP TABLE "DoctorEducation";

-- DropTable
DROP TABLE "DoctorSchedule";

-- DropTable
DROP TABLE "MedicalService";

-- DropTable
DROP TABLE "OrganizationInfo";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Specialty";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_DoctorToMedicalService";

-- DropEnum
DROP TYPE "AppointmentSource";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "AppointmentType";

-- DropEnum
DROP TYPE "ContentCategory";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "specialties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_staff" (
    "id" SERIAL NOT NULL,
    "staff_type" "StaffType" NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "employment_type" "EmploymentType" NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "specialty_id" INTEGER,
    "department_id" INTEGER,
    "education" TEXT,
    "certificate" TEXT,
    "category" TEXT,
    "experience_years" INTEGER,
    "photo_url" VARCHAR(500),

    CONSTRAINT "medical_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialties_name_key" ON "specialties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- AddForeignKey
ALTER TABLE "medical_staff" ADD CONSTRAINT "medical_staff_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_staff" ADD CONSTRAINT "medical_staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
