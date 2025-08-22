import { MailProvider, SendMailParams } from '@/core/contracts/mail-provider'
import { injectable } from 'tsyringe'
import { Resend } from 'resend'
import { env } from '@/config'
import { ForgotPasswordEmail } from './templates/forgot-password-email'

@injectable()
export class ResendMailProvider implements MailProvider {
  private resend = new Resend(env.RESEND_API_KEY)

  async sendMail({ to, subject, template }: SendMailParams): Promise<void> {
    const { name, payload } = template

    let emailComponent: React.ReactElement | null = null

    switch (name) {
      case 'forgot-password':
        emailComponent = ForgotPasswordEmail({
          token: payload.token as string,
        })
        break
      default:
        throw new Error(`Template ${name} not found.`)
    }
    try {
      const { data, error } = await this.resend.emails.send({
        from: env.MAIL_FROM,
        to,
        subject,
        react: emailComponent,
      })

      if (error) {
        console.error('Error sending email:', error)
        throw new Error('Error sending email.')
      }

      console.log(`[ResendMailProvider] E-mail sent to ${to}. ID: ${data?.id}`)
    } catch (err) {
      console.error('Failed to send email:', err)
      throw new Error('Failed to send email.')
    }
  }
}
