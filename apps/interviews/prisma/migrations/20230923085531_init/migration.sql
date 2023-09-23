-- CreateTable
CREATE TABLE "Interview" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "job_id" BIGINT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" BIGSERIAL NOT NULL,
    "interview_id" BIGINT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
