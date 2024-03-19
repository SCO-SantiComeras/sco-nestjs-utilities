export class AuthConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
  algorithm: string;
  newUserActived?: boolean;
}
