const { GoogleGenerativeAI } = require('@google/generative-ai'); // Correct import for the client library

async function validateAddressWithAI(address) {
  try {
    // Initialize Gemini AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a simplified prompt for plausibility checking
    const prompt = `
        Validate if the values in the provided address object make sense and are plausible. Your goal is to confirm that the entries correspond to recognized entities or formats. Focus on plausibility, not precise delivery suitability.

Address Object:
{
  "country": "${address.country}",
  "street_address": "${address.street_address}",
  "postal_code": "${address.postal_code}",
  "city": "${address.city}"
}

Validation Criteria:
1. **Country:**
   - Ensure the 'country' is a recognized and existing country.
   - Correct minor spelling errors or common variations if possible.

2. **City:**
   - Confirm that the 'city' exists within the specified 'country' and is a recognized municipality or administrative division.
   - Correct minor spelling errors or common variations if possible.

3. **Postal Code:**
   - Verify if the 'postal_code' follows the general format for the specified 'country' and 'city'.
   - Broad postal codes are acceptable as long as they align with the country's postal system.

4. **Street Address:**
   - Evaluate if the 'street_address' is plausible as a street name
   - Allow minor variations or corrections, such as fixing typographical errors, if they lead to a plausible result.

Response Format:
- Start your response with either "true" (all fields are plausible) or "false" (one or more fields are implausible).
- Follow this with an explanation of the validation for each field.
    `;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const responseText = response.text().trim();

    // Sanitize the response by removing potential code block markers if present
    const sanitizedResponseText = responseText.replace(/```json|```/g, "").trim();

    // Extract the boolean match status
    const isValid = sanitizedResponseText.startsWith("true");
    const explanation = sanitizedResponseText.replace(/^true|^false/, "").trim();

    return {
      address,
      isValid,
      explanation,
    };
  } catch (err) {
    throw new Error(`Error validating address with AI: ${err.message}`);
  }
}



module.exports = validateAddressWithAI;
