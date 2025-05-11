export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface verifyCodeInfoResponse extends ApiResponse {
  data: {
    fullName: string;
    email: string;
    verificationCodeExpiry: Date;
  };
}
