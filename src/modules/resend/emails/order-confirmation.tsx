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
  Row,
  Column,
} from "@react-email/components"

interface OrderItem {
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string
}

interface OrderConfirmationEmailProps {
  orderNumber: string | number
  customerName: string
  email: string
  items: OrderItem[]
  subtotal: number
  shippingTotal: number
  total: number
  shippingAddress?: {
    address_1: string
    address_2?: string
    postal_code: string
    city: string
  }
}

const formatPrice = (amount: number) => {
  // Gérer les BigNumber de Medusa
  const value = typeof amount === "object" ? (amount as any).numeric || (amount as any).value || 0 : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingTotal,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
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
          <Section style={successBanner}>
            <Heading style={successTitle}>Merci pour votre commande !</Heading>
            <Text style={successText}>
              Commande #{orderNumber} confirmée
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>
              Bonjour {customerName},
            </Text>
            <Text style={paragraph}>
              Nous avons bien reçu votre commande et nous la préparons avec soin.
              Vous recevrez un email avec les informations de suivi dès que votre
              colis sera expédié.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Order items */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Récapitulatif de votre commande
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

          {/* Totals */}
          <Section style={content}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Sous-total</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Livraison</Text>
              </Column>
              <Column>
                <Text style={totalValue}>
                  {shippingTotal === 0 ? "Gratuit" : formatPrice(shippingTotal)}
                </Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={totalRow}>
              <Column>
                <Text style={grandTotalLabel}>Total</Text>
              </Column>
              <Column>
                <Text style={grandTotalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>
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

          {/* Next steps */}
          <Hr style={divider} />
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Prochaines étapes
            </Heading>
            <Text style={paragraph}>
              1. Préparation de votre commande (1-2 jours ouvrés)<br />
              2. Expédition avec suivi par Viticolis<br />
              3. Livraison sous 3-5 jours ouvrés
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
            </Text>
            <Text style={footerText}>
              La vente d&apos;alcool est interdite aux mineurs.
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

const successBanner = {
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  textAlign: "center" as const,
}

const successTitle = {
  color: "#103728",
  fontSize: "28px",
  fontWeight: "500",
  fontFamily: fontSerif,
  fontStyle: "italic" as const,
  margin: "0 0 10px 0",
}

const successText = {
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
  margin: 0,
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
  color: "#5a5a52",
  fontSize: "14px",
  margin: 0,
}

const totalValue = {
  color: "#103728",
  fontSize: "14px",
  textAlign: "right" as const,
  margin: 0,
}

const grandTotalLabel = {
  color: "#103728",
  fontSize: "16px",
  fontWeight: "600",
  margin: 0,
}

const grandTotalValue = {
  color: "#103728",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "right" as const,
  margin: 0,
}

const addressText = {
  color: "#5a5a52",
  fontSize: "14px",
  lineHeight: "1.6",
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

export default OrderConfirmationEmail
