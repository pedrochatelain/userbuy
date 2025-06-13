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

          Determine if the text accurately describes or refers to the content of the image. 
          Focus on the most straightforward and visually relevant interpretation of the text in the context of the image. 
          Avoid unrelated interpretations or alternative meanings of the text that are not supported by the visual content.

          If the text matches or reasonably refers to the image content, respond with "true" followed by an explanation.
          If the text does not match or is unrelated to the image, respond with "false" and explain why there is no match.

          Your response should start with "true" or "false" followed by a space, then the explanation.
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