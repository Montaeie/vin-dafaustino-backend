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

interface OrderItem {
  title: string
  quantity: number
}

interface OrderCanceledEmailProps {
  orderNumber: string | number
  customerName: string
  items: OrderItem[]
  reason?: string
}

export function OrderCanceledEmail({
  orderNumber,
  customerName,
  items,
  reason,
}: OrderCanceledEmailProps) {
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
            <Heading style={bannerTitle}>Commande annulee</Heading>
            <Text style={bannerText}>
              Commande #{orderNumber}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Nous vous confirmons que votre commande #{orderNumber} a ete annulee.
              {reason && ` Motif : ${reason}`}
            </Text>
            <Text style={paragraph}>
              Si vous avez deja ete debite, le remboursement sera effectue sous 5 a 10 jours ouvrables
              sur le moyen de paiement utilise lors de la commande.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Order items */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Articles concernes
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemDetailsCol}>
                  <Text style={itemTitle}>{item.title}</Text>
                  <Text style={itemQuantity}>Quantite : {item.quantity}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Vous souhaitez passer une nouvelle commande ?
            </Text>
            <Button style={ctaButton} href={`${siteUrl}/vins`}>
              Decouvrir nos vins
            </Button>
          </Section>

          {/* Contact */}
          <Hr style={divider} />
          <Section style={content}>
            <Text style={paragraph}>
              Une question ? N'hesitez pas a nous contacter, nous sommes la pour vous aider.
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

const itemRow = {
  marginBottom: "15px",
}

const itemDetailsCol = {
  verticalAlign: "top" as const,
  paddingLeft: "10px",
}

const itemTitle = {
  color: "#103728",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 5px 0",
}

const itemQuantity = {
  color: "#5a5a52",
  fontSize: "12px",
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

export default OrderCanceledEmail
