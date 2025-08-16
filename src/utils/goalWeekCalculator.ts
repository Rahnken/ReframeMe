/**
 * Calculate which week of the goal cycle we're currently in
 * @param startDate - Goal start date
 * @param cycleDuration - Total number of weeks in the cycle
 * @returns Current week number (1-based) or 0 if goal hasn't started yet
 */
export function getCurrentGoalWeek(startDate: string | Date, cycleDuration: number): number {
  const start = new Date(startDate);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // If goal hasn't started yet, return 0
  if (today < start) {
    return 0;
  }
  
  // Calculate days since start
  const daysDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate current week (1-based)
  const weekNumber = Math.floor(daysDiff / 7) + 1;
  
  // Cap at cycle duration (e.g., max week 12 for a 12-week cycle)
  return Math.min(weekNumber, cycleDuration);
}

/**
 * Calculate which week a specific date falls in within the goal cycle
 * @param startDate - Goal start date
 * @param targetDate - Date to check
 * @param cycleDuration - Total number of weeks in the cycle
 * @returns Week number (1-based) or 0 if before start
 */
export function getGoalWeekForDate(startDate: string | Date, targetDate: Date, cycleDuration: number): number {
  const start = new Date(startDate);
  const target = new Date(targetDate);
  
  // Set both dates to midnight
  start.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  // If target is before start, return 0
  if (target < start) {
    return 0;
  }
  
  // Calculate days since start
  const daysDiff = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate week (1-based)
  const weekNumber = Math.floor(daysDiff / 7) + 1;
  
  // Cap at cycle duration
  return Math.min(weekNumber, cycleDuration);
}

/**
 * Get the start and end dates for a specific week in the goal cycle
 * @param startDate - Goal start date
 * @param weekNumber - Week number (1-based)
 * @returns Object with weekStart and weekEnd dates
 */
export function getWeekDateRange(startDate: string | Date, weekNumber: number): { weekStart: Date; weekEnd: Date } {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  // Calculate week start (0-based calculation)
  const weekStart = new Date(start.getTime() + ((weekNumber - 1) * 7 * 24 * 60 * 60 * 1000));
  
  // Calculate week end (6 days after week start)
  const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

/**
 * Check if a goal has completed its cycle
 * @param endDate - Goal end date
 * @returns true if the goal cycle has ended
 */
export function isGoalCycleComplete(endDate: string | Date): boolean {
  const end = new Date(endDate);
  const today = new Date();
  
  end.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);
  
  return today > end;
}