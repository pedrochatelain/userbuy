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

          Strictly determine if the text **precisely** and **unambiguously** describes or refers to the **primary object(s)** in the image.
          Focus exclusively on direct, visual correspondence. Do not infer, generalize, or consider alternative interpretations.
          The text must clearly and specifically identify the main subject(s) of the image.

          If the text **exactly matches or is a direct, accurate reference** to the primary visual content of the image, respond with "true" followed by a concise explanation of the match.

          If the text **does not specifically and unambiguously describe** the primary visual content of the image (even if it's a general category or unrelated), respond with "false", followed by an explanation of why there is no precise match, AND then provide a **concise, accurate recommendation** for what the text *should* be to match the image.

          Your response should start with "true" or "false" followed by a space, then the explanation. If false, the recommendation should follow the explanation, clearly marked, e.g., "Recommendation: [recommended text]".
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