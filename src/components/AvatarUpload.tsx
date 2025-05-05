import React, { useState } from "react"
import { AccountCircle, CloudUpload } from "@mui/icons-material"
import { IconButton, CircularProgress } from "@mui/material"
import { css } from "@emotion/css"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase/fbConfig"

interface AvatarUploadProps {
  contactId: string
  userId: string
  currentAvatarUrl?: string
  onAvatarChange: (url: string) => void
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  contactId,
  userId,
  currentAvatarUrl,
  onAvatarChange,
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const storageRef = ref(
        storage,
        `users/${userId}/contacts/${contactId}/avatar.jpg`
      )

      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      onAvatarChange(downloadURL)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={styles.container}>
      {currentAvatarUrl ? (
        <img
          src={currentAvatarUrl}
          alt="Avatar"
          className={styles.avatarImage}
        />
      ) : (
        <AccountCircle className={styles.avatarIcon} />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.fileInput}
        id={`avatar-upload-${contactId}`}
      />
      <label
        htmlFor={`avatar-upload-${contactId}`}
        className={styles.uploadButton}
      >
        <IconButton component="span" disabled={isUploading}>
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <CloudUpload className={styles.uploadIcon} />
          )}
        </IconButton>
      </label>
    </div>
  )
}

const styles = {
  container: css`
    position: relative;
    width: 48px;
    height: 48px;
    margin-right: 16px;
  `,
  avatarImage: css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  `,
  avatarIcon: css`
    width: 48px;
    height: 48px;
    color: var(--primary-main);
    background-color: rgba(147, 51, 234, 0.1);
    border-radius: 50%;
    padding: 8px;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
      background-color: rgba(147, 51, 234, 0.15);
    }
  `,
  fileInput: css`
    display: none;
  `,
  uploadButton: css`
    position: absolute;
    bottom: -6px;
    right: -6px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 20px;
    height: 20px;

    & .MuiIconButton-root {
      padding: 0;
      &:hover {
        background-color: transparent;
      }
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `,
  uploadIcon: css`
    width: 20px;
    height: 20px;
    background-color: var(--white);
    border-radius: 50%;
    padding: 4px;
  `,
}

export default AvatarUpload
