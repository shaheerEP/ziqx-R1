export const sendMessage = async (prompt, previousMessages = [], onChunk) => {
  try {
    const fullPrompt = previousMessages
      .map((msg) => msg.sender === 'user' ? `User: ${msg.text}` : `Assistant: ${msg.text}`)
      .join('\n') + `\nUser: ${prompt}`;

    const response = await fetch('https://api.ai.ziqx.net/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEndIndex = buffer.indexOf('\n');
        if (lineEndIndex === -1) break;

        const line = buffer.slice(0, lineEndIndex).trim();
        buffer = buffer.slice(lineEndIndex + 1);

        try {
          const parsedChunk = JSON.parse(line);
          if (parsedChunk.response) {
            const thinkMatch = parsedChunk.response.match(/<think>(.*?)<\/think>/s);
            const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';
            
            // Replace think tags with empty string and clean spaces
// Replace think tags with empty string and trim
const cleanedResponse = parsedChunk.response
  .replace(/<think>(.*?)<\/think>/gs, '')  // Remove think tags
  .trim();  // Only trim leading/trailing spaces



  
            onChunk({
              response: cleanedResponse,
              think: thinkContent
            });
          }
        } catch (error) {
          console.error('Error parsing chunk:', error);
        }
      }
    }

    if (buffer.trim()) {
      try {
        const parsedChunk = JSON.parse(buffer);
        // Handle final chunk if needed
      } catch (error) {
        console.error('Error parsing final chunk:', error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    onChunk({ response: 'Error processing request', think: '' });
  }
};