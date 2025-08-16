/**
 * Enhanced fetch wrapper that handles auth errors
 */
export async function fetchWithAuthHandling(url: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(url, options);
    
    // If unauthorized or forbidden, throw an auth error
    if (response.status === 401 || response.status === 403) {
      throw new Error(`unauthorized: ${response.status}`);
    }
    
    // Try to parse the response
    const data = await response.json();
    
    // Check for user not found in the response data
    if (data.message && (
      data.message.includes('user not found') ||
      data.message.includes('User not found') ||
      data.message.includes('unauthorized')
    )) {
      throw new Error(`user not found: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    // Re-throw the error so the calling code can handle it
    throw error;
  }
}

/**
 * Check if an error is an auth-related error
 */
export function isAuthError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || '';
  return (
    error.status === 401 ||
    error.status === 403 ||
    message.includes('unauthorized') ||
    message.includes('user not found') ||
    message.includes('User not found')
  );
}