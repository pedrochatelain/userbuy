const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./src/config/routes');
const { syntaxErrorHandler } = require('./src/middlewares/handleSyntaxError');
const { setupSwagger } = require('./src/config/swagger');
const { startServer } = require('./src/config/server')

const app = express();

// Load environment variables from a .env file into process.env
dotenv.config()

// Middleware
app.use(express.json());
app.use(cors());

// Setup Swagger
setupSwagger(app);

// Register Routes
registerRoutes(app);

// Error-handling middleware
app.use(syntaxErrorHandler);

const multer = require('multer');

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { GoogleGenerativeAI } = require('@google/generative-ai'); // Correct import for the client library

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to create a GoogleGenerativeAI.Part object for the image
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    },
  };
}

// Endpoint to handle image upload and Gemini AI processing
app.post('/upload', upload.single('image'), async (req, res) => {
  const { productDescription } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!productDescription) {
    return res.status(400).json({ message: 'Product description is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageParts = [
      fileToGenerativePart(req.file.buffer, req.file.mimetype),
    ];

    // Create a detailed prompt that leverages Gemini's vision capabilities
    const prompt = `
    Analyze the uploaded image and the following text.
    Image: [The image is provided separately]
    Text: "${productDescription}"

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

    // Respond with the results
    res.status(200).json({
      message: 'Image processed successfully by Gemini Vision',
      productDescription,
      geminiResponse: explanation,
      match: matchResult,
    });

  } catch (error) {
    console.error('Error:', error.message);
    // More specific error handling for Gemini API if needed
    if (error.response && error.response.status) {
        console.error('Gemini API Error Status:', error.response.status);
        console.error('Gemini API Error Data:', await error.response.json());
    }
    res.status(500).json({ message: 'Error processing the image with Gemini Vision', error: error.message });
  }
});

// Connect to Database and Start Server
startServer(app);
