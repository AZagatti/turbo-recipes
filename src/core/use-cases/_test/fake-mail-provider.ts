import { MailProvider, SendMailParams } from '@/core/contracts/mail-provider'

export class FakeMailProvider implements MailProvider {
  public sentMail: SendMailParams[] = []

  async sendMail(params: SendMailParams): Promise<void> {
    this.sentMail.push(params)
  }
}
