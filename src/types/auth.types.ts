export interface AuthenticatedUser {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    profile_picture: string | null,
    phone_number: string,
    role: string | null,
    permissions: Array<string> | null,
    is_verified: boolean
}

export interface AuthenticatedUserResponse extends AuthenticatedUser {
    token: string
}

export interface JwtContext extends AuthenticatedUser {};