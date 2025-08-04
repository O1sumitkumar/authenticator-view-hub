export class TableService {

  /**
   * Format permission levels for display
   */
  static formatPermissions(permissions: any[]): string {
    if (!permissions || permissions.length === 0) return 'None';
    return permissions.map(p => p.level).join(', ');
  }

  /**
   * Get status badge class based on status
   */
  static getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'inactive':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'revoked':
        return 'border-red-200 bg-red-50 text-red-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  }

  /**
   * Get account type badge class
   */
  static getAccountTypeBadgeClass(accountType: string): string {
    switch (accountType.toLowerCase()) {
      case 'business':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'personal':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'temporary':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  }

  /**
   * Check if rights are expiring soon (within 7 days)
   */
  static isExpiringSoon(expiresAt: Date): boolean {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    return new Date(expiresAt) <= sevenDaysFromNow;
  }
}