import { useState } from 'react';
import { toast } from 'sonner';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(successMessage || 'Copied to clipboard!');
      
      // Clear the copied text after 3 seconds
      setTimeout(() => setCopiedText(null), 3000);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy to clipboard');
      return false;
    }
  };

  return { copyToClipboard, copiedText };
}