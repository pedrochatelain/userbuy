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
            
            Determine if the provided text is relevant to or has a sensible connection with the content of the image.
            Consider if the text makes sense as a label, category, or a related concept for what is shown in the image.
            
            If the text is reasonably related to the image content, respond with "true" followed by an explanation.
            Otherwise, respond with "false" and explain why there is no clear or sensible connection.
            
            Your response should start with "true" or "false" followed by a space, then the explanation.
            Example true response: "true The image shows a dog, and the text 'pets' is a relevant category."
            Example false response: "false The image shows a car, but the text talks about a type of fruit."
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
            message: 'Image processed successfully by Gemini Vision',
            description,
            geminiResponse: explanation,
            match: matchResult,
        };
    } catch (err) {
        throw err
    } 
}

module.exports = validateImageDescription