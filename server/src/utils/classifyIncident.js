import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Local Fallback Logic (UNCHANGED)
const localClassifier = (title, description) => {
  const text = (title + " " + description).toLowerCase();

  let category = "other";
  if (
    text.includes("network") ||
    text.includes("wifi") ||
    text.includes("server") ||
    text.includes("downtime") ||
    text.includes("connect") ||
    text.includes("internet") ||
    text.includes("firewall") ||
    text.includes("gateway") ||
    text.includes("routing") ||
    text.includes("vpn")
  )
    category = "network";
  else if (
    text.includes("software") ||
    text.includes("bug") ||
    text.includes("crash") ||
    text.includes("application") ||
    text.includes("loading") ||
    text.includes("update") ||
    text.includes("install") ||
    text.includes("configure") ||
    text.includes("version") ||
    text.includes("expired") ||
    text.includes("log") ||
    text.includes("session") ||
    text.includes("feature") ||
    text.includes("data")
  )
    category = "software";
  else if (
    text.includes("printer") ||
    text.includes("keyboard") ||
    text.includes("laptop") ||
    text.includes("port") ||
    text.includes("modem") ||
    text.includes("ethernet") ||
    text.includes("switch") ||
    text.includes("cable")
  )
    category = "hardware";

  let priority = "low";
  if (text.includes("urgent") || text.includes("down") || text.includes("critical"))
    priority = "critical";
  else if (text.includes("error") || text.includes("failed") || text.includes("slow"))
    priority = "high";
  else if (text.includes("delay") || text.includes("issue") || text.includes("work"))
    priority = "medium";

  return { category, priority, status: "open" };
};

// Gemini Classifier with Fallback
export const classifyIncident = async (title, description) => {
  const text = `Title: ${title}\nDescription: ${description}`;

  try {
    const prompt = `
    Analyze this IT incident and return ONLY a JSON object with:
    - category: one of ["software", "hardware", "network", "other"]
    - priority: one of ["low", "medium", "high", "critical"]

    Example:
    {"category": "network", "priority": "high"}

    Incident:
    ${text}
    `;

    const result = await model.generateContent(prompt);

    // Gemini output
    const raw = result.response.text().trim();

    // Parse JSON
    const parsed = JSON.parse(raw);

    if (!parsed.category || !parsed.priority) {
      throw new Error("Invalid response from model");
    }

    return { ...parsed, status: "open" };
  } catch (error) {
    console.error("⚠️ Gemini API failed, using local fallback:", error.message);
    return localClassifier(title, description);
  }
};
