/**
 * Utility functions for parsing blog content
 */

export function parseEditorJSContent(content: string | null): string {
  if (!content) {
    return 'No description available';
  }
  
  try {
    let parsed;
    
    // Handle different content formats
    if (typeof content === 'string') {
      try {
        parsed = JSON.parse(content);
      } catch {
        // If it's not JSON, treat as plain text
        return content.length > 200 ? content.substring(0, 200) + '...' : content;
      }
    } else {
      parsed = content;
    }
    
    // Try different possible structures
    let blocks = [];
    
    // Standard EditorJS format
    if (parsed?.blocks && Array.isArray(parsed.blocks)) {
      blocks = parsed.blocks;
    }
    // Direct blocks array
    else if (Array.isArray(parsed)) {
      blocks = parsed;
    }
    // Check if content itself is a block
    else if (parsed?.type && parsed?.data) {
      blocks = [parsed];
    }
    
    if (blocks.length === 0) {
      // If no blocks found, try to extract text from any string properties
      const textContent = extractTextFromObject(parsed);
      if (textContent) {
        return textContent.length > 200 ? textContent.substring(0, 200) + '...' : textContent;
      }
      return 'No description available';
    }
    
    // Extract text from blocks
    const textBlocks = blocks
      .map((block: any) => {
        // Handle different block types and structures
        if (block.data?.text) {
          return block.data.text.replace(/<[^>]*>/g, '').trim();
        }
        if (block.data?.content) {
          return block.data.content.replace(/<[^>]*>/g, '').trim();
        }
        if (block.text) {
          return block.text.replace(/<[^>]*>/g, '').trim();
        }
        if (block.data?.items && Array.isArray(block.data.items)) {
          return block.data.items
            .map((item: any) => {
              if (typeof item === 'string') {
                return item.replace(/<[^>]*>/g, '').trim();
              } else if (typeof item === 'object' && item?.text) {
                return item.text.replace(/<[^>]*>/g, '').trim();
              } else if (typeof item === 'object' && item?.content) {
                return item.content.replace(/<[^>]*>/g, '').trim();
              }
              return String(item).replace(/<[^>]*>/g, '').trim();
            })
            .filter((text: string) => text.length > 0)
            .join(' ');
        }
        return '';
      })
      .filter((text: string) => text.length > 0);
    
    if (textBlocks.length === 0) {
      return 'No description available';
    }
    
    const combinedText = textBlocks.join(' ');
    return combinedText.length > 200 ? combinedText.substring(0, 200) + '...' : combinedText;
    
  } catch (error) {
    // Fallback: try to extract any text from the content
    try {
      if (typeof content === 'string') {
        const cleanText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (cleanText.length > 0 && cleanText !== 'null' && cleanText !== 'undefined') {
          return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
        }
      }
    } catch {}
    return 'No description available';
  }
}

// Helper function to extract text from any object structure
function extractTextFromObject(obj: any, maxDepth = 3): string {
  if (maxDepth <= 0 || !obj) return '';
  
  const texts: string[] = [];
  
  function traverse(current: any, depth: number) {
    if (depth <= 0) return;
    
    if (typeof current === 'string') {
      const cleanText = current.replace(/<[^>]*>/g, '').trim();
      if (cleanText.length > 10) { // Only include meaningful text
        texts.push(cleanText);
      }
    } else if (typeof current === 'object' && current !== null) {
      for (const key in current) {
        if (key !== 'blocks' && key !== 'data') { // Skip complex nested objects
          traverse(current[key], depth - 1);
        }
      }
    }
  }
  
  traverse(obj, maxDepth);
  return texts.join(' ').substring(0, 200);
}
