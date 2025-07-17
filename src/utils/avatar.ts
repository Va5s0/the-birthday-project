// Avatar utility functions

/**
 * Generate initials from first and last name
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim().charAt(0).toUpperCase() || ''
  const last = lastName?.trim().charAt(0).toUpperCase() || ''
  
  if (first && last) {
    return `${first}${last}`
  } else if (first) {
    return first
  } else if (last) {
    return last
  } else {
    return 'U' // Default for "User"
  }
}

/**
 * Generate a consistent color for a contact based on their name
 */
export const getAvatarColor = (firstName?: string, lastName?: string): { background: string; color: string } => {
  const name = `${firstName || ''}${lastName || ''}`.toLowerCase()
  
  // Generate a simple hash from the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Convert to positive number
  hash = Math.abs(hash)
  
  // Define a set of beautiful, accessible color combinations
  const colorPalette = [
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #ff8a80 0%, #ff80ab 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', color: '#ffffff' },
    
    // New color combinations
    { background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #00cec9 0%, #55efc4 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)', color: '#333333' },
    { background: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #54a0ff 0%, #5f27cd 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ff6348 0%, #ff3838 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #7bed9f 0%, #70a1ff 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ff9f1a 0%, #ff6b35 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #a4b0be 0%, #57606f 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ff3867 0%, #ff0844 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #06ffa5 0%, #7209b7 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #3742fa 0%, #2f3542 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #2ed573 0%, #7bed9f 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)', color: '#ffffff' },
    { background: 'linear-gradient(135deg, #3742fa 0%, #70a1ff 100%)', color: '#ffffff' },
  ]
  
  // Select color based on hash
  const colorIndex = hash % colorPalette.length
  return colorPalette[colorIndex]
}

/**
 * Check if a string is a valid URL (for avatar images)
 */
export const isValidUrl = (url?: string): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}