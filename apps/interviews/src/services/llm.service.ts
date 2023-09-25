import { ofetch } from "ofetch";

type LLMResponse = {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}[];

export default class LLMService {
  static async completion(
    history: { role: string; content: string }[]
  ): Promise<LLMResponse> {
    return await ofetch("https://llm-proxy-two.vercel.app/api/completion", {
      method: "post",
      body: { history },
    });
  }
}
