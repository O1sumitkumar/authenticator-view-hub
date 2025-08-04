import { RightsJWTPayload, Permission } from '@/types/admin';

// Browser-compatible JWT service without Node.js dependencies
export class JWTService {
  /**
   * Base64 URL encode (browser-compatible)
   */
  private static base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64 URL decode (browser-compatible)
   */
  private static base64UrlDecode(str: string): string {
    // Add padding if needed
    str += '='.repeat((4 - str.length % 4) % 4);
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
  }

  /**
   * Generate a simple JWT-like token (for demo purposes)
   * Note: This is NOT cryptographically secure and should not be used in production
   */
  static generateRightsCode(payload: {
    accountId: string;
    applicationId: string;
    permissions: Permission[];
    accountType: 'Temporary' | 'Personal' | 'Business';
    expiresAt: Date;
    rightsId: string;
    sharedFrom?: string;
  }): string {
    const now = Math.floor(Date.now() / 1000);
    const exp = Math.floor(payload.expiresAt.getTime() / 1000);

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const jwtPayload: RightsJWTPayload = {
      // Standard JWT claims
      iss: 'centralized-admin-system',
      sub: payload.accountId,
      aud: payload.applicationId,
      exp: exp,
      iat: now,
      jti: payload.rightsId,
      
      // Custom claims
      permissions: payload.permissions,
      accountType: payload.accountType,
      applicationId: payload.applicationId,
      accountId: payload.accountId,
      ...(payload.sharedFrom && { sharedFrom: payload.sharedFrom }),
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(jwtPayload));
    
    // For demo purposes, we'll create a simple signature
    // In production, this should be properly signed with a secret
    const signature = this.base64UrlEncode(`signature-${payload.rightsId}-${now}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Decode JWT token (browser-compatible)
   */
  static decodeRightsCode(token: string): RightsJWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }

      const payload = this.base64UrlDecode(parts[1]);
      return JSON.parse(payload) as RightsJWTPayload;
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }

  /**
   * Verify and decode a JWT rights code (simplified for browser)
   */
  static verifyRightsCode(token: string): RightsJWTPayload | null {
    try {
      const decoded = this.decodeRightsCode(token);
      if (!decoded) return null;
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.warn('JWT token is expired');
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Check if a JWT token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeRightsCode(token);
      if (!decoded || !decoded.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration date
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeRightsCode(token);
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token expires within specified hours
   */
  static isTokenExpiringSoon(token: string, hoursThreshold: number = 24): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;
    
    const now = new Date();
    const thresholdTime = new Date(now.getTime() + (hoursThreshold * 60 * 60 * 1000));
    
    return expiration <= thresholdTime;
  }

  /**
   * Get readable token info for display
   */
  static getTokenInfo(token: string): { 
    isValid: boolean; 
    isExpired: boolean; 
    expiresAt?: Date; 
    permissions?: Permission[];
    accountType?: string;
  } {
    try {
      const decoded = this.decodeRightsCode(token);
      if (!decoded) {
        return { isValid: false, isExpired: true };
      }

      const isExpired = this.isTokenExpired(token);
      const expiresAt = this.getTokenExpiration(token);

      return {
        isValid: true,
        isExpired,
        expiresAt: expiresAt || undefined,
        permissions: decoded.permissions,
        accountType: decoded.accountType,
      };
    } catch (error) {
      return { isValid: false, isExpired: true };
    }
  }
}