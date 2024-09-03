export type WelcomeMailContext = {
    name: string,
}

export type VerificationCodeMailContext = {
    name: string,
    otp: string
}

export type ResetPasswordMailContext = {
    name: string,
    link: string,
}