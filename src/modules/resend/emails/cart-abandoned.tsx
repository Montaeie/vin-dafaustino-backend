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

interface CartItem {
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string
}

interface CartAbandonedEmailProps {
  customerName: string
  items: CartItem[]
  cartTotal: number
  cartUrl: string
}

const formatPrice = (amount: number) => {
  const value = typeof amount === "object" ? (amount as any).numeric || (amount as any).value || 0 : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function CartAbandonedEmail({
  customerName,
  items,
  cartTotal,
  cartUrl,
}: CartAbandonedEmailProps) {
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
            <Heading style={bannerTitle}>Vous avez oublie quelque chose ?</Heading>
            <Text style={bannerText}>
              Votre panier vous attend
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Nous avons remarque que vous avez laisse des articles dans votre panier.
              Ces vins d'exception n'attendent que vous !
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Cart items */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Votre selection
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemDetailsCol}>
                  <Text style={itemTitle}>{item.title}</Text>
                  <Text style={itemQuantity}>Quantite : {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>{formatPrice(item.unit_price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Total */}
          <Section style={content}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total du panier</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{formatPrice(cartTotal)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Finalisez votre commande en quelques clics
            </Text>
            <Button style={ctaButton} href={cartUrl || `${siteUrl}/panier`}>
              Reprendre mon panier
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Reassurance */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Pourquoi choisir Da Faustino ?
            </Heading>
            <Text style={benefitItem}>- Vins selectionnes par nos sommeliers depuis 30 ans</Text>
            <Text style={benefitItem}>- Livraison soignee par transporteur specialise</Text>
            <Text style={benefitItem}>- Livraison offerte des 150€ d'achat</Text>
            <Text style={benefitItem}>- Paiement securise</Text>
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
            <Text style={footerUnsubscribe}>
              Vous recevez cet email car vous avez un panier en attente sur dafaustino.com
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

const itemPriceCol = {
  width: "100px",
  textAlign: "right" as const,
  verticalAlign: "top" as const,
}

const itemPrice = {
  color: "#103728",
  fontSize: "14px",
  fontWeight: "500",
  margin: 0,
}

const totalRow = {
  marginBottom: "8px",
}

const totalLabel = {
  color: "#103728",
  fontSize: "16px",
  fontWeight: "600",
  margin: 0,
}

const totalValue = {
  color: "#103728",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "right" as const,
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
  border: "1px solid #103728",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  padding: "14px 36px",
  textDecoration: "none",
  letterSpacing: "0.5px",
}

const benefitItem = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
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

const footerUnsubscribe = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "10px",
  margin: "10px 0 0 0",
}

const footerCopyright = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "11px",
  margin: "10px 0 0 0",
}

export default CartAbandonedEmail
