export interface AuthenticatedUser {
    id: string,
    email: string,
    first_name: string,
    role: string | null,
    permissions: Array<string> | null,
}

export interface AuthenticatedUserResponse extends AuthenticatedUser {
    token: string
}