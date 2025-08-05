export class AuthorNotFoundError extends Error {
  constructor() {
    super('Author not found.')
  }
}
