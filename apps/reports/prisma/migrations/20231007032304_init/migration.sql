-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "employer_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "candidate_id" INTEGER NOT NULL,
    "summary" TEXT,
    "suitability_score" INTEGER,
    "sentiment_summary" TEXT,
    "knowledge_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_interview_id_key" ON "Report"("interview_id");
