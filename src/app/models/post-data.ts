// post-data.interface.ts
export interface PostData {
    services: string;
    target: string;
    businessName: string;
    content: string;
    includePhoto: boolean;
    photoUrl?: string;
    useFacebookToken: boolean;
    facebookToken?: string;
  }