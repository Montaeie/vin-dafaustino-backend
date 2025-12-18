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

interface AccountDeletedEmailProps {
  customerName: string
  email: string
}

export function AccountDeletedEmail({ customerName, email }: AccountDeletedEmailProps) {
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
            <Heading style={bannerTitle}>Compte supprime</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Nous vous confirmons que votre compte Da Faustino a ete supprime
              avec succes, conformement a votre demande.
            </Text>
            <Text style={paragraph}>
              Toutes vos donnees personnelles ont ete effacees de nos systemes,
              a l'exception des informations que nous sommes legalement tenus
              de conserver (factures, historique des commandes pour la comptabilite).
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What's deleted */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Donnees supprimees
            </Heading>
            <Text style={listItem}>- Informations personnelles (nom, adresse)</Text>
            <Text style={listItem}>- Adresses de livraison enregistrees</Text>
            <Text style={listItem}>- Preferences de compte</Text>
            <Text style={listItem}>- Historique de navigation</Text>
          </Section>

          <Hr style={divider} />

          {/* Comeback message */}
          <Section style={content}>
            <Text style={paragraph}>
              Nous sommes tristes de vous voir partir. Si vous changez d'avis,
              vous pouvez creer un nouveau compte a tout moment.
            </Text>
            <Text style={paragraph}>
              Merci d'avoir fait partie de la famille Da Faustino.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Envie de revenir ?
            </Text>
            <Button style={ctaButton} href={`${siteUrl}/connexion`}>
              Creer un nouveau compte
            </Button>
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

const listItem = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
}

const divider = {
  borderColor: "#d4d2c7",
  margin: 0,
}

const ctaSection = {
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  textAlign: "center" as const,
}

const ctaText = {
  color: "#103728",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 20px 0",
}

const ctaButton = {
  backgroundColor: "transparent",
  border: "1px solid #103728",
  color: "#103728",
  fontSize: "14px",
  fontWeight: "500",
  padding: "12px 32px",
  textDecoration: "none",
  letterSpacing: "0.5px",
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

export default AccountDeletedEmail
