const { GoogleGenAI } = require('@google/genai');
const { ProductRejectedByAI } = require('../errors/customErrors'); 

async function categorizeProductWithAI(productName) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
    You are a system designed to evaluate product names for their appropriateness, logical sense, and plausibility within the context of typical e-commerce product listings. You will also suggest a single, most plausible, **short, and concise** e-commerce category for the given product name. Avoid overly specific or deeply nested categories. Aim for categories like "Electronics," "Apparel," or "Books," not "Sports & Outdoors > Team Sports > Soccer > Soccer Balls."

    ### Evaluation Criteria for Product Name:
    1.  **Bad Words/Offensive Language**:
        -   The name contains profanity, slurs, hate speech, or language that could be considered offensive or harmful.

    2.  **Nonsense/Gibberish**:
        -   The name consists of random characters, nonsensical combinations of letters, or words that do not form coherent phrases in any language.
        -   The entry does not resemble terms typically associated with products.

    3.  **Irrelevant or Misleading Content**:
        -   The name includes URLs, email addresses, phone numbers, or other unrelated information.
        -   The entry suggests something clearly not plausible or relevant in an e-commerce context (e.g., "Time Travel Machine" or "asdf12345" as a product name).

    4.  **Extreme Length/Repetition**:
        -   The name is excessively long or contains repetitive characters/words that do not contribute to a meaningful description.

    5.  **E-commerce Context Appropriateness**:
        -   The name must align with items plausibly sold on an e-commerce platform. Product names should describe real or plausible items.

    ### Instructions:
    Evaluate the following product name:
    "${productName}"

    If the product name is valid and appropriate, suggest a single, most plausible, **short, and concise** e-commerce category for it.

    ### Response Rules:
    - If the product name violates any of the evaluation criteria, return a JSON object with a detailed issue for the 'name' field as shown in the first example below.
    - If the product name is valid, return a JSON object with an empty 'issues' object and the suggested 'category' as shown in the second example below.

    ### Example Responses:
    #### When issues are found:
    \`\`\`json
    {
        "issues": {
            "name": "Explanation of the issue (e.g., contains offensive language, is nonsensical or excessively long)"
        },
        "category": null
    }
    \`\`\`

    #### When no issues are found:
    \`\`\`json
    {
        "issues": {},
        "category": "Suggested Category (e.g., 'Sports', 'Electronics', 'Apparel')"
    }
    \`\`\`

    ### Notes:
    - All languages are acceptable as long as they adhere to the criteria above.
    - Use your understanding of typical e-commerce product listings to assess plausibility and suggest categories.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    const responseText = response.text.trim();

    // Sanitize the response by removing backticks and surrounding code blocks
    const sanitizedResponseText = responseText.replace(/```json|```/g, "").trim();

    let responseJson;
    try {
        responseJson = JSON.parse(sanitizedResponseText);
    } catch (parseErr) {
        throw new Error("Failed to parse AI response as JSON: " + sanitizedResponseText);
    }

    if (responseJson && responseJson.issues && responseJson.issues.name) {
        throw new ProductRejectedByAI(responseJson.issues);
    }

    // If no issues, return the suggested category along with an empty issues object
    return { issues: {}, category: responseJson.category };
}

module.exports = categorizeProductWithAI