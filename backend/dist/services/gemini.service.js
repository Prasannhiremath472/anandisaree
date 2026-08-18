"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductDescription = generateProductDescription;
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
async function generateProductDescription(input) {
    if (!env_1.env.GEMINI_API_KEY) {
        throw ApiError_1.ApiError.badRequest("Gemini API key is not configured on the server");
    }
    const prompt = `Write a compelling, elegant product description for an Indian ethnic wear e-commerce listing.

Product name: ${input.name}
Fabric: ${input.fabric}
Color: ${input.color}
${input.category ? `Category: ${input.category}` : ""}
${input.shortDescription ? `Existing short description: ${input.shortDescription}` : ""}

Write 2-3 short paragraphs (80-120 words total) in a warm, premium retail tone suitable for a saree/ethnic wear brand called "Anandi Sarees". Highlight the fabric feel, drape, occasion suitability, and craftsmanship. Do not use markdown formatting, headings, or bullet points — plain prose only. Do not invent specific measurements, certifications, or claims that weren't provided.`;
    const response = await fetch(`${GEMINI_URL}?key=${env_1.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
                thinkingConfig: { thinkingBudget: 0 },
            },
        }),
    });
    if (!response.ok) {
        const errText = await response.text();
        throw ApiError_1.ApiError.internal(`Gemini request failed: ${response.status} ${errText}`);
    }
    const data = (await response.json());
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
        throw ApiError_1.ApiError.internal("Gemini returned no description");
    }
    return text;
}
//# sourceMappingURL=gemini.service.js.map