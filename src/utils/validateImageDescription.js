const { GoogleGenerativeAI } = require('@google/generative-ai'); // Correct import for the client library

// Helper function to create a GoogleGenerativeAI.Part object for the image
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    },
  };
}

async function validateImageDescription(description, image) {
    try {
        // Initialize Gemini AI with your API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageParts = [
            fileToGenerativePart(image.buffer, image.mimetype),
        ];

        // Keep the strict prompt for the initial validation attempt
        const prompt = `
            Analyze the uploaded image and the following text.
            Image: [The image is provided separately]
            Text: "${description}"

            Strictly determine if the text **accurately identifies the core type or category** of the primary object(s) in the image.
            Focus exclusively on whether the text correctly names **what the item(s) are**, rather than their quantity or specific variations.
            Do not infer, generalize to broader categories, or consider alternative interpretations beyond the direct identification of the main subject(s).

            If the text **correctly names the type or category** of the primary visual content of the image, respond with "true" followed by a concise explanation of the match. This includes instances where the text refers to a single item but multiple items of that type are present, or vice-versa, as long as the core identification is correct.

            If the text **does not accurately name the type or category** of the primary visual content of the image (e.g., it's a completely different item, or too broad/narrow for the visual content), respond with "false", followed by an explanation of why there is no precise type match, AND then provide a **Suggested Product Title** based solely on what the image depicts. This title should be concise and suitable for an e-commerce product listing.

            Your response should start with "true" or "false" followed by a space, then the explanation. If false, the Suggested Product Title should follow the explanation, clearly marked, e.g., "Suggested Product Title: [suggested text]".
        `;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        let responseText = response.text().trim(); // Use let as we might modify it

        // Sanitize the response by removing potential code block markers if present
        const sanitizedResponseText = responseText.replace(/```json|```/g, "").trim();

        // Extract the boolean match status
        const matchResult = sanitizedResponseText.startsWith("true");
        let explanation = sanitizedResponseText.replace(/^true|^false/, "").trim(); // Use let

        // --- Add the conditional logic for suggesting isolation ---
        if (!matchResult) {
            // Check if the original explanation already has a suggested title
            const suggestedTitleMatch = explanation.match(/Suggested Product Title: \[?([^\]]+)\]?/);
            let suggestedTitle = '';
            if (suggestedTitleMatch && suggestedTitleMatch[1]) {
                suggestedTitle = suggestedTitleMatch[1].trim();
                // Remove the suggested title from the explanation for cleaner message
                explanation = explanation.replace(/Suggested Product Title: \[?([^\]]+)\]?/, '').trim();
            }

            // Append the suggestion for isolation
            explanation += ` It's possible the image contains multiple items or distractions. If you're certain about your product description, please try again with a photo that isolates the product you are selling.`;

            // Re-add the suggested product title if it existed
            if (suggestedTitle) {
                explanation += ` Suggested Product Title: ${suggestedTitle}`;
            }
        }

        return {
            productName: description,
            geminiResponse: explanation, // This now includes the isolation suggestion if match is false
            match: matchResult,
        };
    } catch (err) {
        console.error("Error in validateImageDescription:", err);
        throw err;
    }
}

module.exports = validateImageDescription