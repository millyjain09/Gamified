const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDebugQuestion = async (req, res) => {
    try {
        const { levelId } = req.body;

        // Pattern logic based on your exact 5-level structure!
        let concept = "";
        let topics = "";

        if (levelId === 1) {
            concept = "Basic syntax and simple logical errors.";
            topics = "Missing semicolon, Wrong variable name, Simple loop mistake, Incorrect condition, Print/output errors.";
        } else if (levelId === 2) {
            concept = "Basic algorithm logic errors.";
            topics = "Linear search bug, Maximum element, Sum of array, String reverse, Basic conditions.";
        } else if (levelId === 3) {
            concept = "Algorithm mistakes.";
            topics = "Binary search, Recursion mistake, Stack push/pop, Queue implementation, Sorting bug.";
        } else if (levelId === 4) {
            concept = "Complex DSA bugs.";
            topics = "Linked List, Tree traversal, DFS/BFS, Dynamic programming mistake.";
        } else if (levelId === 5) {
            concept = "Competitive coding debugging.";
            topics = "Graph algorithms, DP problems, Sliding window, Greedy algorithms.";
        } else {
            concept = "Basic C++ errors.";
            topics = "Syntax errors.";
        }

        // The strict prompt to force Gemini to follow your rules and return ONLY JSON
        const prompt = `
            You are an expert C++ DSA instructor generating bugs for a debugging game.
            Create ONE short C++ code snippet (5-15 lines) with exactly ONE bug based on these constraints:
            Level: ${levelId}
            Concept: ${concept}
            Allowed Topics: ${topics}
            
            You MUST return the response strictly as a JSON object with this exact structure, without any markdown formatting like \`\`\`json:
            {
                "brief": "A short 1-2 sentence story/explanation of what the code is SUPPOSED to do and a hint about the anomaly.",
                "buggyCode": "The C++ code containing the bug as a string. Use \\n for newlines.",
                "expectedFix": "The exact small string/character the user needs to type to fix it (e.g., ';' or 'i < n' or 'mid + 1' or 'root->data')"
            }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown formatting if Gemini adds it accidentally
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const questionData = JSON.parse(text);
        res.status(200).json(questionData);

    } catch (error) {
        console.error("Error generating question:", error);
        res.status(500).json({ error: "System failed to generate anomaly." });
    }
};

module.exports = { generateDebugQuestion };