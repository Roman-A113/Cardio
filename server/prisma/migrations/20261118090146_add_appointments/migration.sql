/*
  Warnings:

  - The `specialtyId` column on the `MedicalService` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `departments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `departments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `medical_staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `medical_staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialty_id` column on the `medical_staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `department_id` column on the `medical_staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `specialties` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `patientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientPhone` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `staffId` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `staffId` on the `DoctorSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_staffId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSchedule" DROP CONSTRAINT "DoctorSchedule_staffId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalService" DROP CONSTRAINT "MedicalService_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "medical_staff" DROP CONSTRAINT "medical_staff_department_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_staff" DROP CONSTRAINT "medical_staff_specialty_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientEmail" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "patientPhone" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
DROP COLUMN "staffId",
ADD COLUMN     "staffId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DoctorSchedule" DROP COLUMN "staffId",
ADD COLUMN     "staffId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MedicalService" DROP COLUMN "specialtyId",
ADD COLUMN     "specialtyId" INTEGER;

-- AlterTable
ALTER TABLE "departments" DROP CONSTRAINT "departments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medical_staff" DROP CONSTRAINT "medical_staff_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "specialty_id",
ADD COLUMN     "specialty_id" INTEGER,
DROP COLUMN "department_id",
ADD COLUMN     "department_id" INTEGER,
ADD CONSTRAINT "medical_staff_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "specialties" DROP CONSTRAINT "specialties_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "specialties_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "DoctorEducation" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "specialty" TEXT NOT NULL,
    "qualification" TEXT,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "DoctorEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAccreditation" (
    "id" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "documentNumber" TEXT,
    "validUntil" TIMESTAMP(3),
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "DoctorAccreditation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_staffId_scheduledAt_key" ON "Appointment"("staffId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "medical_staff" ADD CONSTRAINT "medical_staff_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_staff" ADD CONSTRAINT "medical_staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorEducation" ADD CONSTRAINT "DoctorEducation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "medical_staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAccreditation" ADD CONSTRAINT "DoctorAccreditation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "medical_staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "medical_staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalService" ADD CONSTRAINT "MedicalService_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "medical_staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
