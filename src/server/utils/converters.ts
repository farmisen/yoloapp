import { type Options, input } from "node-pdftocairo"
import "server-only"

export const pdfToPng = async (pdfBuffer: Buffer): Promise<Buffer | undefined> => {
  try {
    const options = {
      format: "png",
      bin: "/usr/bin/pdftocairo",
      singlefile: true
    } satisfies Options
    const imageBuffer = await input(pdfBuffer, options).output()
    return imageBuffer[0]
  } catch (err) {
    console.error("Error converting PDF to image:", err)
    throw err
  }
}
