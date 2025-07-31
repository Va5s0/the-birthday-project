export const errorCodes = {
  "auth/email-already-in-use": "Email already in use",
  "auth/invalid-email": "Invalid email",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/weak-password": "The password is too weak",
  "auth/user-disabled": "This user has been disabled",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Wrong password",
  "auth/expired-action-code": "Password reset code has expired",
  "auth/invalid-action-code": "Password reset code is invalid",
  "auth/requires-recent-login": "Session expired. New login required",

  "storage/unknown": "An unknown error occurred",
  "storage/object-not-found": "No object exists at the desired reference",
  "storage/bucket-not-found": "No bucket is configured for Cloud Storage",
  "storage/project-not-found": "No project is configured for Cloud Storage",
  "storage/quota-exceeded":
    "Quota on your Cloud Storage bucket has been exceeded",
  "storage/unauthenticated":
    "User is unauthenticated, please authenticate and try again",
  "storage/unauthorized": "User is not authorized to perform the action",
  "storage/retry-limit-exceeded":
    "The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again",
  "storage/invalid-checksum":
    "File on the client does not match the checksum of the file received by the server. Try uploading again",
  "storage/canceled": "User canceled the operation",
  "storage/invalid-event-name": "Invalid event name provided",
  "storage/invalid-url": "Invalid URL provided to refFromURL()",
  "storage/invalid-argument": "The argument passed is invalid",
  "storage/no-default-bucket":
    "No bucket has been set in your config's storageBucket property",
  "storage/cannot-slice-blob":
    "Commonly occurs when the local file has changed. Try uploading again after verifying that the local file hasn't changed",
  "storage/server-file-wrong-size":
    "File on the client does not match the size of the file recieved by the server. Try uploading again",
}
