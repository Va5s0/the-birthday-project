import { getBlob, StorageReference } from "firebase/storage"

export const displayFile = async (id: string, ref: StorageReference) => {
  const image = document.getElementById(id) as HTMLImageElement
  const blob = await getBlob(ref)
  const objectUrl = URL.createObjectURL(blob)
  image.src = objectUrl
}
