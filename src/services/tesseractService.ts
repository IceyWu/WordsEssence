import { createWorker } from 'tesseract.js';

export const recognizeText = async (imageFile: File): Promise<string> => {
  try {
    const worker = await createWorker('chi_sim+eng');
    
    const { data: { text } } = await worker.recognize(imageFile);
    
    await worker.terminate();
    
    return text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to recognize text from image');
  }
};