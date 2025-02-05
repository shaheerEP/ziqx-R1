import axios from 'axios';

export const sendMessage = async (prompt, previousMessages = []) => {
    try {
      // Prepare the full prompt by including previous messages
      const fullPrompt = previousMessages
        .map((msg) => msg.sender === 'user' ? `User: ${msg.text}` : `Assistant: ${msg.text}`)
        .join('\n') + `\nUser: ${prompt}`;
  
      const response = await axios.post(
        'https://api.ai.ziqx.net/generate',
        { prompt: fullPrompt },
        { responseType: 'stream' } // Handle streaming response
      );
  
      let buffer = ''; // Buffer to accumulate chunks
      let fullResponse = ''; // Final response string
      let thinkContent = ''; // Content inside <think> tags
  
      for await (const chunk of response.data) {
        buffer += chunk.toString(); // Append the current chunk to the buffer
  
        // Try to parse the buffer as JSON
        try {
          const parsedChunk = JSON.parse(buffer);
  
          if (parsedChunk.response) {
            // Extract content inside <think> tags
            const thinkMatch = parsedChunk.response.match(/<think>(.*?)<\/think>/s);
            if (thinkMatch) {
              thinkContent += thinkMatch[1].trim(); // Append the extracted content
            }
  
            // Remove content between <think> and </think>
            const cleanedResponse = parsedChunk.response.replace(/<think>.*?<\/think>/gs, '').trim();
  
            // Ensure proper spacing between chunks
            if (fullResponse && cleanedResponse && !/\s$/.test(fullResponse) && !/^\s/.test(cleanedResponse)) {
              fullResponse += ' '; // Add a space if needed
            }
  
            fullResponse += cleanedResponse; // Append the cleaned response text
          }
  
          // Clear the buffer after successfully parsing a chunk
          buffer = '';
  
          // Stop processing if the API indicates the response is done
          if (parsedChunk.done) break;
        } catch (parseError) {
          // If parsing fails, it means the buffer contains incomplete JSON
          continue;
        }
      }
  
      return { response: fullResponse.trim(), think: thinkContent.trim() };
    } catch (error) {
      console.error('Error fetching response from API:', error);
      return { response: 'Sorry, there was an error processing your request.', think: '' };
    }
  };