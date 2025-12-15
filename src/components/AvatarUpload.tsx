import React, { useState } from 'react';
import { CloudUpload } from '@mui/icons-material';
import { IconButton, CircularProgress } from '@mui/material';
import { css } from '@emotion/css';
import { api } from '../services/api';
import { getInitials, getAvatarColor } from '../utils/avatar';

interface AvatarUploadProps {
  contactId: string;
  userId: string;
  currentAvatarUrl?: string;
  onAvatarChange: (url: string) => void;
  firstName?: string;
  lastName?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  contactId,
  currentAvatarUrl,
  onAvatarChange,
  firstName,
  lastName,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Generate initials and colors
  const initials = getInitials(firstName, lastName);
  const { background, color } = getAvatarColor(firstName, lastName);

  // Get the full avatar URL from relative path
  const avatarUrl = currentAvatarUrl
    ? api.getAvatarUrl(currentAvatarUrl)
    : undefined;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setIsUploading(true);
      const updatedContact = await api.uploadContactAvatar(contactId, file);

      // Pass the relative URL to parent
      if (updatedContact.avatarUrl) {
        onAvatarChange(updatedContact.avatarUrl);
      }

      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className={styles.avatarImage} />
      ) : (
        <div
          className={styles.initialsAvatar}
          style={{
            background,
            color,
          }}
        >
          {initials}
        </div>
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
  );
};

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
  initialsAvatar: css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
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
};

export default AvatarUpload;
