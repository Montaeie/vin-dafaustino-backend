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

interface NewsletterSubscriptionEmailProps {
  email: string
}

export function NewsletterSubscriptionEmail({ email }: NewsletterSubscriptionEmailProps) {
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

          {/* Welcome banner */}
          <Section style={welcomeBanner}>
            <Heading style={welcomeTitle}>Bienvenue dans notre newsletter !</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Merci de vous etre inscrit a notre newsletter !
            </Text>
            <Text style={paragraph}>
              Vous recevrez desormais nos actualites, les nouveaux arrivages
              et des offres exclusives directement dans votre boite mail.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What to expect */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Ce que vous recevrez
            </Heading>
            <Text style={benefitItem}>- Nouveaux vins et arrivages exclusifs</Text>
            <Text style={benefitItem}>- Offres et promotions reservees aux abonnes</Text>
            <Text style={benefitItem}>- Conseils accords mets & vins</Text>
            <Text style={benefitItem}>- Actualites de nos vignerons partenaires</Text>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              En attendant, decouvrez notre selection
            </Text>
            <Button style={ctaButton} href={`${siteUrl}/vins`}>
              Voir nos vins
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              Vous recevez cet email car vous vous etes inscrit sur dafaustino.com
            </Text>
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

const welcomeBanner = {
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  textAlign: "center" as const,
}

const welcomeTitle = {
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

const benefitItem = {
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
  backgroundColor: "#103728",
  border: "none",
  color: "#ffffff",
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

export default NewsletterSubscriptionEmail
