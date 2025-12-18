import React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from "@react-email/components"

interface PasswordResetEmailProps {
  customerName: string
  resetLink: string
}

export function PasswordResetEmail({ customerName, resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>DA FAUSTINO</Text>
          </Section>

          {/* Banner */}
          <Section style={banner}>
            <Heading style={bannerTitle}>Reinitialisation de mot de passe</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Vous avez demandé la réinitialisation de votre mot de passe.
              Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={resetLink}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>

          <Section style={content}>
            <Text style={warningText}>
              Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé
              cette réinitialisation, vous pouvez ignorer cet email.
            </Text>
            <Text style={linkFallback}>
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </Text>
            <Text style={linkText}>{resetLink}</Text>
          </Section>

          {/* Security note */}
          <Hr style={divider} />
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Conseils de sécurité
            </Heading>
            <Text style={securityItem}>• Ne partagez jamais votre mot de passe</Text>
            <Text style={securityItem}>• Utilisez un mot de passe unique pour ce site</Text>
            <Text style={securityItem}>• Évitez les mots de passe trop simples</Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
            </Text>
            <Text style={footerText}>
              La vente d'alcool est interdite aux mineurs.
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Da Faustino. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles - Alignés avec le design system Da Faustino
const fontSerif = "'Cormorant Garamond', Georgia, serif"
const fontSans = "Roboto, -apple-system, BlinkMacSystemFont, sans-serif"

const main = {
  backgroundColor: "#f0eee4",
  fontFamily: fontSans,
}

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const header = {
  backgroundColor: "#103728",
  padding: "20px",
  textAlign: "center" as const,
}

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  fontFamily: fontSerif,
  letterSpacing: "3px",
  margin: 0,
}

const banner = {
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  textAlign: "center" as const,
}

const bannerTitle = {
  color: "#103728",
  fontSize: "28px",
  fontWeight: "500",
  fontFamily: fontSerif,
  fontStyle: "italic" as const,
  margin: "0",
}

const content = {
  backgroundColor: "#ffffff",
  padding: "20px",
}

const greeting = {
  color: "#103728",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 10px 0",
}

const paragraph = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
}

const sectionTitle = {
  color: "#103728",
  fontSize: "20px",
  fontWeight: "500",
  fontFamily: fontSerif,
  fontStyle: "italic" as const,
  margin: "0 0 15px 0",
}

const ctaSection = {
  backgroundColor: "#ffffff",
  padding: "10px 20px 30px 20px",
  textAlign: "center" as const,
}

const ctaButton = {
  backgroundColor: "#103728",
  border: "1px solid #103728",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  padding: "12px 32px",
  textDecoration: "none",
  letterSpacing: "0.5px",
}

const warningText = {
  color: "#b45309",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
  padding: "10px",
  backgroundColor: "#fef3c7",
}

const linkFallback = {
  color: "#5a5a52",
  fontSize: "12px",
  margin: "0 0 5px 0",
}

const linkText = {
  color: "#103728",
  fontSize: "11px",
  wordBreak: "break-all" as const,
  margin: "0",
}

const securityItem = {
  color: "#5a5a52",
  fontSize: "13px",
  lineHeight: "1.8",
  margin: "0",
}

const divider = {
  borderColor: "#d4d2c7",
  margin: 0,
}

const footer = {
  backgroundColor: "#103728",
  padding: "20px",
  textAlign: "center" as const,
}

const footerText = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "11px",
  margin: "0 0 5px 0",
}

const footerCopyright = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "11px",
  margin: "15px 0 0 0",
}

export default PasswordResetEmail
