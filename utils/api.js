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

    if (!response.body) throw new Error("No body found in the response");
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const processChunk = async ({ done, value }) => {
      if (done) return;
    
      try {
        const decodedString = decoder.decode(value, { stream: true });
        const parsed = JSON.parse(decodedString);
        
        if (parsed.response) {
          // Extract think content
          const thinkMatch = parsed.response.match(/<think>(.*?)<\/think>/s);
          const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';
          
          // Clean response: Replace <think> blocks with spaces and normalize
          const cleanedResponse = parsed.response
            .replace(/<think>.*?<\/think>/gs, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    
          onChunk({ 
            response: cleanedResponse, 
            think: thinkContent 
          });
        }
      } catch (error) {
        console.error('Error processing chunk:', error);
      }
    
      // Continue processing next chunk
      reader.read().then(processChunk);
    };

    // Start processing the stream
    reader.read().then(processChunk);
  } catch (error) {
    console.error('Error:', error);
    onChunk({ response: 'Error processing request', think: '' });
  }
};