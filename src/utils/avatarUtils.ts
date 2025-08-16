/**
 * Avatar utility functions for generating user initials and fallback avatars
 */

/**
 * Generate initials from first and last name
 * Falls back to username initials if names are not available
 */
export const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
  username?: string
): string => {
  // If we have first and last name, use those
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  // If we only have first name, use first two characters
  if (firstName && firstName.length >= 2) {
    return firstName.slice(0, 2).toUpperCase();
  }
  
  // If we only have last name, use first two characters
  if (lastName && lastName.length >= 2) {
    return lastName.slice(0, 2).toUpperCase();
  }
  
  // Fall back to username initials
  if (username && username.length >= 2) {
    return username.slice(0, 2).toUpperCase();
  }
  
  // Ultimate fallback
  return "??";
};

/**
 * Generate avatar props with consistent styling
 */
export const getAvatarProps = (
  firstName?: string | null,
  lastName?: string | null,
  username?: string,
  size: "sm" | "md" | "lg" = "md"
) => {
  const initials = getInitials(firstName, lastName, username);
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10",
    lg: "w-24 h-24 text-xl"
  };
  
  return {
    className: sizeClasses[size],
    fallbackClassName: "bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground border border-border/20",
    initials
  };
};