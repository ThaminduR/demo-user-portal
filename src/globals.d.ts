export {};

declare global {
  interface Window {
    grecaptcha: ReCaptchaV2.ReCaptcha;
  }
}