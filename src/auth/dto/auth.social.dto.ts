interface SocialUser {
  email: string;
  name: string;
  providerId: string;
}

export type SocialRequest = Request & { user: SocialUser };
