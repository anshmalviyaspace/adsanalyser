import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const inputSchema = z.object({
  imageBase64: z.string().min(1).max(10_000_000),
  objective: z.enum(["leads", "purchases"]),
  targetValue: z.string().max(100).optional(),
});

export type AnalysisResult = {
  campaignState: string;
  bestPerformer: { name: string; reason: string };
  worstPerformer: { name: string; reason: string };
  decision: string;
  reason: string;
  actionPlan: string[];
  riskLevel: "low" | "medium" | "high";
  confidenceScore: number;
  dataConfidence: "High" | "Medium" | "Low";
};

const SYSTEM_PROMPT = `You are an expert Meta Ads analyst. The user will provide a screenshot of their Meta Ads dashboard along with their campaign objective and optional target metrics.

Analyze the screenshot and return a JSON object with this exact structure:
{
  "campaignState": "Brief state description (e.g. 'Scaling Phase', 'Learning Phase', 'Declining Performance')",
  "bestPerformer": {
    "name": "Name of the best performing ad/ad set",
    "reason": "Why it's the best performer with specific metrics"
  },
  "worstPerformer": {
    "name": "Name of the worst performing ad/ad set",
    "reason": "Why it's the worst performer with specific metrics"
  },
  "decision": "The main action to take (one clear sentence)",
  "reason": "Short explanation of why this decision makes sense",
  "actionPlan": ["Step 1 with timing", "Step 2 with timing", "Step 3 with timing", "Step 4 with timing", "Step 5 with timing"],
  "riskLevel": "low" | "medium" | "high",
  "confidenceScore": 0-100,
  "dataConfidence": "High" | "Medium" | "Low"
}

Focus on actionable, specific recommendations. Be direct and decisive. Do not hedge.
Return ONLY valid JSON, no markdown or extra text.`;

export const analyzeAds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.infer<typeof inputSchema>) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.VELLUM_API_KEY;
    if (!apiKey) {
      throw new Error("VELLUM_API_KEY is not configured");
    }

    const userPrompt = `Campaign Objective: ${data.objective === "leads" ? "Lead Generation" : "Purchases/Conversions"}
${data.targetValue ? `Target: ${data.targetValue}` : "No specific target set."}

Please analyze the attached Meta Ads screenshot and provide your recommendations.`;

    // Vellum API call using the ad-hoc endpoint
    const response = await fetch("https://predict.vellum.ai/v1/execute-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        prompt_deployment_name: "ad-doctor-analysis",
        inputs: [
          {
            name: "system_prompt",
            type: "STRING",
            value: SYSTEM_PROMPT,
          },
          {
            name: "user_message",
            type: "STRING",
            value: userPrompt,
          },
          {
            name: "image",
            type: "IMAGE",
            value: {
              src: data.imageBase64,
            },
          },
        ],
        release_tag: "LATEST",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Vellum API error [${response.status}]: ${errorBody}`);

      // Fallback: try the generate endpoint instead
      return await fallbackAnalysis(apiKey, data);
    }

    const result = await response.json();

    // Extract the text output from Vellum response
    const output = result.outputs?.find((o: any) => o.type === "STRING")?.value;

    if (!output) {
      console.error("No output from Vellum:", JSON.stringify(result));
      return await fallbackAnalysis(apiKey, data);
    }

    try {
      const parsed = JSON.parse(output) as AnalysisResult;
      return { result: parsed, error: null };
    } catch {
      console.error("Failed to parse Vellum output as JSON:", output);
      return await fallbackAnalysis(apiKey, data);
    }
  });

async function fallbackAnalysis(
  apiKey: string,
  data: z.infer<typeof inputSchema>
): Promise<{ result: AnalysisResult; error: string | null }> {
  const userPrompt = `Campaign Objective: ${data.objective === "leads" ? "Lead Generation" : "Purchases/Conversions"}
${data.targetValue ? `Target: ${data.targetValue}` : "No specific target set."}

Analyze this Meta Ads screenshot and provide recommendations.`;

  try {
    const response = await fetch("https://predict.vellum.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        deployment_name: "ad-doctor-analysis",
        requests: [
          {
            input_values: {
              system_prompt: SYSTEM_PROMPT,
              user_message: userPrompt,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vellum fallback error [${response.status}]: ${errorText}`);
      throw new Error(`Vellum API failed: ${response.status}`);
    }

    const result = await response.json();
    const text = result.results?.[0]?.data?.completions?.[0]?.text;

    if (text) {
      const parsed = JSON.parse(text) as AnalysisResult;
      return { result: parsed, error: null };
    }

    throw new Error("No text in Vellum response");
  } catch (error) {
    console.error("Fallback analysis failed:", error);
    throw new Error(
      "Unable to analyze the screenshot. Please try again later."
    );
  }
}
