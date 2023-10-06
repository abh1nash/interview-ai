import { ofetch } from "ofetch";

type LLMResponse = {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}[];

export class LLMReqeustData {
  private __raw: string = "";
  constructor(
    public chatHistory: { question: string; answer: string }[],
    public jobDescription: string
  ) {
    this.__raw += `Job Deescription:
${jobDescription}
`;
    for (const message of chatHistory) {
      this.__raw += `Q: ${message.question}
A: ${message.answer}\n\n`;
    }
  }

  toString() {
    return this.__raw;
  }
}

export default class LLMService {
  static async generateReport(data: LLMReqeustData): Promise<LLMResponse> {
    const chat = [
      {
        role: "system",
        content: `Given a list of messages between an interviewer and a interviewee, your job is to generate a report of the interview based on the following criteria the  interviewee's suitability to the job, sentiment, knowledge, and the summary of the interview based on the job description and the complete conversation history. Analyze if the candidate is telling the truth in the interview and prepare a brutally honest report. 

            Your response should be in JSON format as follows:
            {
            "summary": "interview summary",
            "suitabilityScore": "candidate's suitability to the job out of 100 based on all given criteria",
            "sentimentSummary": "candidate's sentiment towards the job",
            "knowledgeSummary": "summary of the candidate's knowledge in the field required by the job"
            }`,
      },
      {
        role: "user",
        content: data.toString(),
      },
    ];
    return await ofetch("https://llm-proxy-two.vercel.app/api/completion", {
      method: "post",
      body: { history: chat },
    });
  }
}
