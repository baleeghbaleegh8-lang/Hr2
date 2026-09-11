export interface FeatureFlagsConfig {
  ENABLE_AI: boolean;
  ENABLE_PDF: boolean;
  ENABLE_POWERPOINT: boolean;
  ENABLE_OFFLINE: boolean;
  ENABLE_SHARING: boolean;
  ENABLE_MULTI_TENANT: boolean;
  ENABLE_WEBSOCKETS: boolean;
  ENABLE_EMAIL: boolean;
}

class FeatureFlagsService {
  private flags: FeatureFlagsConfig = {
    ENABLE_AI: true,
    ENABLE_PDF: true,
    ENABLE_POWERPOINT: true,
    ENABLE_OFFLINE: true,
    ENABLE_SHARING: true,
    ENABLE_MULTI_TENANT: true,
    ENABLE_WEBSOCKETS: false,
    ENABLE_EMAIL: true,
  };

  public getFlags(): FeatureFlagsConfig {
    return { ...this.flags };
  }

  public toggleFlag(key: keyof FeatureFlagsConfig): boolean {
    this.flags[key] = !this.flags[key];
    return this.flags[key];
  }

  public setFlag(key: keyof FeatureFlagsConfig, value: boolean) {
    this.flags[key] = value;
  }
}

export const featureFlags = new FeatureFlagsService();
