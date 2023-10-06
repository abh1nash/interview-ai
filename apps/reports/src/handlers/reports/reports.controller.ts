import { Request, Response, NextFunction } from "express";
import prisma from "prisma/client";

export class ReportsController {
  // List all reports for a specific job
  async listByJob(request: Request, response: Response, next: NextFunction) {
    try {
      const jobId = parseInt(request.params.jobId);
      const reports = await prisma.report.findMany({ where: { jobId } });

      if (!reports || reports.length === 0) {
        response
          .status(404)
          .send({ message: "No reports found for this job." });
        return;
      }

      response.status(200).json(reports);
    } catch (error) {
      console.error("Error listing reports:", error);
      response.status(500).send({ message: "Internal Server Error" });
    }
  }

  // Get detailed information for a specific report
  async getReport(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const report = await prisma.report.findUnique({ where: { id } });

      if (!report) {
        response.status(404).send({ message: "Report not found." });
        return;
      }

      response.status(200).json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      response.status(500).send({ message: "Internal Server Error" });
    }
  }
}
