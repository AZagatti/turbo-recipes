import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Tailwind,
} from '@react-email/components'

interface ForgotPasswordEmailProps {
  token: string
}

const baseUrl = 'http://localhost:3000'

export function ForgotPasswordEmail({ token }: ForgotPasswordEmailProps) {
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Turbo Recipes - Recuperação de Senha</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto p-5 pb-12">
            <Text className="text-base leading-6">Olá,</Text>
            <Text className="text-base leading-6">
              Recebemos uma solicitação para redefinir a senha da sua conta no
              Turbo Recipes.
            </Text>
            <Text className="text-base leading-6">
              Clique no botão abaixo para escolher uma nova senha:
            </Text>
            <Button
              className="rounded-md bg-orange-600 px-5 py-3 text-center text-[16px] font-semibold text-white"
              href={resetLink}
            >
              Redefinir Senha
            </Button>
            <Text className="text-base leading-6">
              Se você não solicitou isso, pode ignorar este e-mail com
              segurança.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
