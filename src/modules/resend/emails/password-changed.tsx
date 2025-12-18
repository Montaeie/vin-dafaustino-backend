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
  Link,
} from "@react-email/components"

interface PasswordChangedEmailProps {
  customerName: string
  email: string
}

export function PasswordChangedEmail({ customerName, email }: PasswordChangedEmailProps) {
  const siteUrl = process.env.STOREFRONT_URL || "https://dafaustino.com"

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
            <Heading style={bannerTitle}>Mot de passe modifie</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Nous vous confirmons que le mot de passe de votre compte Da Faustino
              a ete modifie avec succes.
            </Text>
            <Text style={paragraph}>
              Si vous n'etes pas a l'origine de cette modification, veuillez
              contacter immediatement notre service client ou reinitialiser
              votre mot de passe.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Account info */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Informations du compte
            </Heading>
            <Text style={infoItem}>
              Email : {email}
            </Text>
            <Text style={infoItem}>
              Date de modification : {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Security tips */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Conseils de securite
            </Heading>
            <Text style={securityItem}>- Ne partagez jamais votre mot de passe</Text>
            <Text style={securityItem}>- Utilisez un mot de passe unique pour chaque site</Text>
            <Text style={securityItem}>- Evitez les mots de passe trop simples</Text>
          </Section>

          <Hr style={divider} />

          {/* Help */}
          <Section style={content}>
            <Text style={paragraph}>
              Besoin d'aide ?{" "}
              <Link href={`${siteUrl}/contact`} style={link}>
                Contactez-nous
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              L'abus d'alcool est dangereux pour la sante. A consommer avec moderation.
            </Text>
            <Text style={footerText}>
              La vente d'alcool est interdite aux mineurs.
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Da Faustino. Tous droits reserves.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles - Alignes avec le design system Da Faustino
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

const infoItem = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
}

const securityItem = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
}

const link = {
  color: "#103728",
  fontWeight: "600",
  textDecoration: "underline",
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

export default PasswordChangedEmail
