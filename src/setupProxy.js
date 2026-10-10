const express = require("express");
const { GoogleGenAI, Type } = require("@google/genai");

module.exports = function (app) {
  app.use(express.json({ limit: "15mb" }));

  // AI Financial Coach Endpoint
  app.post("/api/ai/coach", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const { userQuestion, expenses = [], budgets = [], savingsGoals = [], balance = 0, currency = "₹" } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const contextPrompt = `
You are the PennyWise AI Financial Coach, a friendly, non-judgmental, smart financial mentor dedicated to helping college students manage their money, stretch their pocket money runway, and reach their savings goals.

STUDENT'S CURRENT FINANCIAL DATA:
- Current Remaining Balance / Pocket Money: ${currency}${balance}
- Active Budgets: ${JSON.stringify(budgets)}
- Recent Expenses (Total ${expenses.length} records): ${JSON.stringify(expenses.slice(0, 30))}
- Active Savings Goals: ${JSON.stringify(savingsGoals)}

STUDENT'S QUESTION / TOPIC:
"${userQuestion || "Analyze my spending and give me your top 3 personalized student savings tips."}"

Provide thoughtful, specific, actionable advice. If asking a general question, answer it while connecting it back to their actual spending numbers if relevant.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contextPrompt,
        config: {
          systemInstruction:
            "You are PennyWise AI Financial Coach for college students. Be encouraging, highly practical, realistic about college budgets (dining hall vs ramen vs cafe, textbooks, shared rent, transit, subscriptions), and give structured answers with clear bullet points.",
        },
      });

      return res.json({
        reply: response.text || "I took a look at your budget! Keep tracking your expenses to build stronger insights.",
      });
    } catch (err) {
      console.error("AI Coach Error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate AI Coach advice." });
    }
  });

  // AI Receipt Scanner Endpoint
  app.post("/api/ai/scan-receipt", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const { imageBase64, mimeType = "image/jpeg" } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64 payload" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Remove data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const promptPart = {
        text: `Extract the receipt details from this image. Return a JSON object with:
- merchant: name of the store, restaurant, or vendor
- date: formatted as YYYY-MM-DD (or current date if not visible)
- amount: total numerical price/amount charged (number, e.g. 249.50)
- category: one of ["Food & Dining", "Housing", "Academics", "Transport", "Lifestyle", "Groceries", "Utilities", "Healthcare", "Other"]
- itemsSummary: brief 1-sentence summary of items bought
- confidence: high, medium, or low
`,
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchant: { type: Type.STRING },
              date: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              itemsSummary: { type: Type.STRING },
              confidence: { type: Type.STRING },
            },
            required: ["merchant", "amount", "category"],
          },
        },
      });

      const extracted = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: extracted });
    } catch (err) {
      console.error("Receipt Scanner Error:", err);
      return res.status(500).json({ error: err.message || "Failed to scan receipt image." });
    }
  });
};
