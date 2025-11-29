declare module "@shelby-protocol/sdk" {
  export interface ShelbyClientConfig {
    apiUrl: string;
    apiKey?: string;
  }

  export interface UploadOptions {
    file: File;
  }

  export interface UploadResponse {
    success: boolean;
    url?: string;
    cid?: string;
    error?: string;
  }

  export class ShelbyClient {
    constructor(config: ShelbyClientConfig);
    upload(options: UploadOptions): Promise<UploadResponse>;
  }
}
