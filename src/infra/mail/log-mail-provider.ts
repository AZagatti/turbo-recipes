import { MailProvider, SendMailParams } from '@/core/contracts/mail-provider'
import { injectable } from 'tsyringe'

@injectable()
export class LogMailProvider implements MailProvider {
  async sendMail({ to, subject, template }: SendMailParams): Promise<void> {
    console.log('--- E-MAIL ENVIADO (LOG) ---')
    console.log(`Para: ${to}`)
    console.log(`Assunto: ${subject}`)
    console.log('Template:', template)
    console.log('-----------------------------')
  }
}
