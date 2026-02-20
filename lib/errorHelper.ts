import { IRecognitionException } from 'chevrotain';

export function formatShaclError(input: string, errors: IRecognitionException[]): string {
  const firstError = errors[0];
  const messageBuilder: string[] = ['Parse error'];
  
  const token = firstError.token;
  const lineIdx = token.startLine;

  if (lineIdx !== undefined && !Number.isNaN(lineIdx)) {
    const lines = input.split('\n');
    const errorLine = lines[lineIdx - 1];
    
    messageBuilder.push(` on line ${lineIdx}:\n${errorLine}`);
    
    const columnIdx = token.startColumn;
    if (columnIdx !== undefined) {
      messageBuilder.push(`\n${'-'.repeat(columnIdx - 1)}^`);
    }
  }

  // Include the message and the specific Token Type name for debugging
  const tokenTypeName = (token.tokenType as any).name || 'UnknownToken';
  messageBuilder.push(`\n${firstError.message} (Found token type: ${tokenTypeName})`);
  
  return messageBuilder.join('');
}