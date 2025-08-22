interface SendMailParams {
  to: string
  subject: string
  body: string
}

export interface MailProvider {
  sendMail(params: SendMailParams): Promise<void>
}
