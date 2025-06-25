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
        
        // Create a detailed prompt that leverages Gemini's vision capabilities
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
        const responseText = response.text().trim();
        
        // Sanitize the response by removing potential code block markers if present
        const sanitizedResponseText = responseText.replace(/```json|```/g, "").trim();
        
        // Extract the boolean match status
        const matchResult = sanitizedResponseText.startsWith("true");
        const explanation = sanitizedResponseText.replace(/^true|^false/, "").trim();
        return {
            productName: description,
            geminiResponse: explanation,
            match: matchResult,
        };
    } catch (err) {
        throw err
    } 
}

module.exports = validateImageDescription