// Simple request cache to prevent duplicate API calls
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Generate a cache key from request config
   */
  getCacheKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get(url, params = {}, maxAge = 30000) { // 30 seconds default
    const key = this.getCacheKey(url, params);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set cache data
   */
  set(url, params = {}, data) {
    const key = this.getCacheKey(url, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache for specific URL or all
   */
  clear(url = null, params = {}) {
    if (url) {
      const key = this.getCacheKey(url, params);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Prevent duplicate in-flight requests
   */
  getPendingRequest(url, params = {}) {
    const key = this.getCacheKey(url, params);
    return this.pendingRequests.get(key);
  }

  /**
   * Store pending request
   */
  setPendingRequest(url, params = {}, promise) {
    const key = this.getCacheKey(url, params);
    this.pendingRequests.set(key, promise);
    
    // Clean up when request completes
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
    
    return promise;
  }

  /**
   * Clear old cache entries
   */
  cleanup(maxAge = 60000) { // 1 minute default
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
const requestCache = new RequestCache();

// Cleanup old cache entries every minute
setInterval(() => {
  requestCache.cleanup();
}, 60000);

export default requestCache;
