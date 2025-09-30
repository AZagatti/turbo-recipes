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
      <Preview>Turbo Recipes - Password Recovery</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto p-5 pb-12">
            <Text className="text-base leading-6">Hello,</Text>
            <Text className="text-base leading-6">
              We received a request to reset the password for your account on
              Turbo Recipes.
            </Text>
            <Text className="text-base leading-6">
              Click the button below to choose a new password:
            </Text>
            <Button
              className="rounded-md bg-orange-600 px-5 py-3 text-center text-[16px] font-semibold text-white"
              href={resetLink}
            >
              Reset Password
            </Button>
            <Text className="text-base leading-6">
              If you did not request this, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
