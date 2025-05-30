const { GoogleGenAI } = require('@google/genai');
const { ProductRejectedByAI } = require('../errors/customErrors'); 

async function checkProductWithGoogleAI(product) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
    You are a system designed to evaluate product category and name entries for their appropriateness, logical sense, and plausibility within the context of typical e-commerce product listings.

    ### Evaluation Criteria:
    1. **Bad Words/Offensive Language**:  
       - The category or name contains profanity, slurs, hate speech, or language that could be considered offensive or harmful.
       
    2. **Nonsense/Gibberish**:  
       - The category or name consists of random characters, nonsensical combinations of letters, or words that do not form coherent phrases in any language.  
       - The entry does not resemble terms typically associated with products or their categories.

    3. **Irrelevant or Misleading Content**:  
       - The category or name includes URLs, email addresses, phone numbers, or other unrelated information.  
       - The entry suggests something clearly not plausible or relevant in an e-commerce context (e.g., "Time Travel Machine" or "asdf12345" as a product name).

    4. **Extreme Length/Repetition**:  
       - The category or name is excessively long or contains repetitive characters/words that do not contribute to a meaningful description.

    5. **E-commerce Context Appropriateness**:  
       - The category or name must align with items plausibly sold in an e-commerce platform. For instance, common product categories might include "Electronics," "Clothing," or "Books," and product names should describe real or plausible items within those categories.

    ### Instructions:
    Evaluate the following product input:
    {
        "category": "${product.category}",
        "name": "${product.name}"
    }

    ### Response Rules:
    - If the category or name violates any of these criteria, return a JSON object with detailed issues for each field as shown in the example below.
    - If both the category and name are valid, return an empty \`issues\` object.

    ### Example Responses:
    #### When issues are found:
    \`\`\`json
    {
        "issues": {
            "category": "Explanation of the issue (e.g., contains offensive language, is irrelevant to e-commerce)",
            "name": "Explanation of the issue (e.g., is nonsensical or excessively long)"
        }
    }
    \`\`\`

    #### When no issues are found:
    \`\`\`json
    {
        "issues": {}
    }
    \`\`\`

    ### Notes:
    - All languages are acceptable as long as they adhere to the criteria above.
    - Use your understanding of typical e-commerce product listings to assess plausibility.
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

    if (responseJson && responseJson.issues && (responseJson.issues.category || responseJson.issues.name)) {
        throw new ProductRejectedByAI(responseJson.issues);
    }
}

module.exports = checkProductWithGoogleAI