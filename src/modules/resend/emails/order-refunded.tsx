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
  Row,
  Column,
} from "@react-email/components"

interface OrderRefundedEmailProps {
  orderNumber: string | number
  customerName: string
  refundAmount: number
  reason?: string
}

const formatPrice = (amount: number) => {
  const value = typeof amount === "object" ? (amount as any).numeric || (amount as any).value || 0 : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function OrderRefundedEmail({
  orderNumber,
  customerName,
  refundAmount,
  reason,
}: OrderRefundedEmailProps) {
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
            <Heading style={bannerTitle}>Remboursement confirme</Heading>
            <Text style={bannerText}>
              Commande #{orderNumber}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Nous vous confirmons que votre remboursement a ete effectue avec succes.
            </Text>
            {reason && (
              <Text style={paragraph}>
                Motif : {reason}
              </Text>
            )}
          </Section>

          <Hr style={divider} />

          {/* Refund details */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Details du remboursement
            </Heading>
            <Row style={refundRow}>
              <Column>
                <Text style={refundLabel}>Montant rembourse</Text>
              </Column>
              <Column>
                <Text style={refundValue}>{formatPrice(refundAmount)}</Text>
              </Column>
            </Row>
            <Text style={infoText}>
              Le remboursement sera credite sur votre moyen de paiement initial
              sous 5 a 10 jours ouvrables, selon votre banque.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Nous esperons vous revoir bientot
            </Text>
            <Button style={ctaButton} href={`${siteUrl}/vins`}>
              Decouvrir nos vins
            </Button>
          </Section>

          {/* Contact */}
          <Hr style={divider} />
          <Section style={content}>
            <Text style={paragraph}>
              Une question concernant votre remboursement ? N'hesitez pas a nous contacter.
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
  margin: "0 0 10px 0",
}

const bannerText = {
  color: "#5a5a52",
  fontSize: "16px",
  margin: 0,
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

const divider = {
  borderColor: "#d4d2c7",
  margin: 0,
}

const refundRow = {
  marginBottom: "15px",
}

const refundLabel = {
  color: "#5a5a52",
  fontSize: "14px",
  margin: 0,
}

const refundValue = {
  color: "#103728",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "right" as const,
  margin: 0,
}

const infoText = {
  color: "#5a5a52",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "15px 0 0 0",
  padding: "10px",
  backgroundColor: "#f0eee4",
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

export default OrderRefundedEmail
