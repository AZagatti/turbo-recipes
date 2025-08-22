export interface SendMailParams {
  to: string
  subject: string
  template: {
    name: 'forgot-password'
    payload: Record<string, unknown>
  }
}

export interface MailProvider {
  sendMail(params: SendMailParams): Promise<void>
}
