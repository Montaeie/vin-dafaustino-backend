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
  Link,
  Row,
  Column,
} from "@react-email/components"

interface OrderItem {
  title: string
  quantity: number
}

interface OrderShippedEmailProps {
  orderNumber: string | number
  customerName: string
  items: OrderItem[]
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  shippingAddress?: {
    address_1: string
    address_2?: string
    postal_code: string
    city: string
  }
}

export function OrderShippedEmail({
  orderNumber,
  customerName,
  items,
  trackingNumber,
  trackingUrl,
  carrier = "Viticolis",
  shippingAddress,
}: OrderShippedEmailProps) {
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

          {/* Success banner */}
          <Section style={shippedBanner}>
            <Heading style={shippedTitle}>Votre commande est en route !</Heading>
            <Text style={shippedText}>
              Commande #{orderNumber}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {customerName},</Text>
            <Text style={paragraph}>
              Bonne nouvelle ! Votre commande a été expédiée et est en route vers vous.
              {carrier && ` Elle vous sera livrée par ${carrier}.`}
            </Text>
          </Section>

          {/* Tracking */}
          {trackingNumber && (
            <>
              <Hr style={divider} />
              <Section style={trackingSection}>
                <Heading as="h2" style={sectionTitle}>
                  Suivi de votre colis
                </Heading>
                <Row style={trackingRow}>
                  <Column>
                    <Text style={trackingLabel}>Transporteur</Text>
                    <Text style={trackingValue}>{carrier}</Text>
                  </Column>
                  <Column>
                    <Text style={trackingLabel}>N° de suivi</Text>
                    <Text style={trackingValue}>{trackingNumber}</Text>
                  </Column>
                </Row>
                {trackingUrl && (
                  <Button style={trackButton} href={trackingUrl}>
                    Suivre mon colis
                  </Button>
                )}
              </Section>
            </>
          )}

          <Hr style={divider} />

          {/* Order items */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Articles expédiés
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

          {/* Shipping address */}
          {shippingAddress && (
            <>
              <Hr style={divider} />
              <Section style={content}>
                <Heading as="h2" style={sectionTitle}>
                  Adresse de livraison
                </Heading>
                <Text style={addressText}>
                  {shippingAddress.address_1}
                  {shippingAddress.address_2 && <><br />{shippingAddress.address_2}</>}
                  <br />
                  {shippingAddress.postal_code} {shippingAddress.city}
                  <br />
                  France
                </Text>
              </Section>
            </>
          )}

          {/* Delivery info */}
          <Hr style={divider} />
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Informations de livraison
            </Heading>
            <Text style={paragraph}>
              • Délai estimé : 3-5 jours ouvrés<br />
              • Livraison par transporteur spécialisé vin<br />
              • Signature requise à la réception
            </Text>
            <Text style={warningText}>
              Verifiez l'etat du colis a la reception. En cas de dommage,
              refusez le colis ou emettez des reserves aupres du livreur.
            </Text>
          </Section>

          {/* CTA */}
          <Hr style={divider} />
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Une question sur votre livraison ?
            </Text>
            <Link style={ctaLink} href={`${siteUrl}/contact`}>
              Contactez-nous
            </Link>
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

const shippedBanner = {
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  textAlign: "center" as const,
}

const shippedTitle = {
  color: "#103728",
  fontSize: "28px",
  fontWeight: "500",
  fontFamily: fontSerif,
  fontStyle: "italic" as const,
  margin: "0 0 10px 0",
}

const shippedText = {
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

const trackingSection = {
  backgroundColor: "#ffffff",
  padding: "20px",
  textAlign: "center" as const,
}

const trackingRow = {
  marginBottom: "20px",
}

const trackingLabel = {
  color: "#5a5a52",
  fontSize: "12px",
  margin: "0 0 5px 0",
  textTransform: "uppercase" as const,
}

const trackingValue = {
  color: "#103728",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
}

const trackButton = {
  backgroundColor: "#103728",
  border: "1px solid #103728",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  padding: "12px 32px",
  textDecoration: "none",
  letterSpacing: "0.5px",
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

const addressText = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
}

const warningText = {
  color: "#b45309",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "15px 0 0 0",
  padding: "10px",
  backgroundColor: "#fef3c7",
}

const ctaSection = {
  backgroundColor: "#ffffff",
  padding: "20px",
  textAlign: "center" as const,
}

const ctaText = {
  color: "#5a5a52",
  fontSize: "14px",
  margin: "0 0 10px 0",
}

const ctaLink = {
  color: "#103728",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "underline",
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

export default OrderShippedEmail
