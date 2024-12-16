import Image from "next/image"
import { type FC } from "react"

import { Input } from "~/components/ui/input"

type FileUploadProps = {
  accept?: string
  maxSize?: number
  value: File | null
  previewUrl: string | null
  onChange: (file: File | null) => void
}

const FileUpload: FC<FileUploadProps> = ({
  accept,
  maxSize,
  value,
  previewUrl,
  onChange
}: FileUploadProps) => {
  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) {
            onChange(null)
            return
          }

          if (maxSize && file.size > maxSize) {
            e.target.value = ""
            onChange(null)
            return
          }

          onChange(file)
        }}
      />
      {value && (
        <p className="text-sm text-muted-foreground">Selected file: {value.name}</p>
      )}
      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">Preview:</p>
          <Image
            src={previewUrl}
            alt="File preview"
            width={300}
            height={300}
            className="max-h-48 object-contain border rounded-md"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      )}
      {value?.type === "application/pdf" && (
        <p className="text-sm text-muted-foreground mt-2">PDF preview not available</p>
      )}
    </div>
  )
}

export default FileUpload
