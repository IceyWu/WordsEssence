import { createWorker } from 'tesseract.js'

export async function recognizeText(imageFile: File): Promise<string> {
  const worker = await createWorker('chi_sim+eng', 1, {
		workerPath: 'https://fastly.jsdelivr.net/npm/tesseract.js@v5.1.1/dist/worker.min.js',
	})

  try {
    const { data: { text } } = await worker.recognize(imageFile)
    await worker.terminate()
    return text
  }
 catch (error) {
    await worker.terminate()
    throw error
  }
}
