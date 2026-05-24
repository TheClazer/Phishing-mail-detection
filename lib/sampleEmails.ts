/**
 * Curated sample emails covering the canonical phishing patterns.
 *
 * Lets new users try the app instantly without having to dig up a real
 * suspicious email from their inbox. Each sample is a realistic-but-fictional
 * scenario based on attacks documented by APWG, Proofpoint, and Krebs.
 */

export type SampleEmail = {
  id: string;
  label: string;
  description: string;
  isPhishing: boolean;
  body: string;
};

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "credential-phish-bank",
    label: "Bank credential phish",
    description: "Classic 'verify your account' panic-bait with a lookalike domain.",
    isPhishing: true,
    body: `From: SecurityAlerts <security@hdfc-bank-verify.com>
Subject: URGENT: Unusual sign-in attempt detected
Date: Today

Dear Customer,

We have detected a suspicious sign-in attempt on your HDFC NetBanking account from an unrecognized device located in Lagos, Nigeria.

For your protection, your account has been temporarily limited. To restore full access, please verify your identity within 24 hours by clicking the link below.

VERIFY NOW: http://hdfc-bank-verify.com/secure-login?ref=urgent

Failure to verify will result in permanent account suspension and possible loss of funds.

This is an automated message. Do not reply.

HDFC Security Team`,
  },
  {
    id: "invoice-phish-vendor",
    label: "Fake invoice / vendor",
    description: "Business email compromise pattern with an attached 'invoice'.",
    isPhishing: true,
    body: `From: Accounting <billing@aws-cloud-billing.com>
Subject: Invoice #INV-2026-78421 — Payment due
Date: Today

Hi,

Please find attached your AWS cloud services invoice for the period ending 31 March 2026.

Amount due: $4,827.14
Due date: Today (immediate payment required to avoid service interruption)

PAY NOW: https://aws-cloud-billing.com/pay?invoice=INV-2026-78421

If you do not pay within 4 hours, your services will be terminated and all data will be permanently deleted.

For questions, contact billing@aws-cloud-billing.com.

Best regards,
AWS Billing Department`,
  },
  {
    id: "legitimate-newsletter",
    label: "Legitimate newsletter",
    description: "A normal product newsletter with no urgency or credential request.",
    isPhishing: false,
    body: `From: GitHub <noreply@github.com>
Subject: The week in open source — March edition

Hey Rayyan,

Here's what's new on GitHub this week:

- Copilot now supports custom instructions per repository
- The new Actions cache backend is GA — up to 40% faster cold starts
- Security: a new advisory on the popular xz-utils package (CVE-2024-3094)

You're receiving this because you opted in to the GitHub developer newsletter.
Manage your email preferences: https://github.com/settings/emails

— The GitHub team`,
  },
  {
    id: "spear-phish-impersonation",
    label: "CEO impersonation (spear phish)",
    description: "Targeted impersonation pretending to be a senior exec asking for an urgent favor.",
    isPhishing: true,
    body: `From: Sundar Pichai <s.pichai.exec@gmail.com>
Subject: Quick favor — are you at your desk?
Date: Today

Hey,

I'm in back-to-back meetings and need you to handle something time-sensitive. Are you available right now?

I need you to purchase $500 in Apple gift cards for a client appreciation gift. Please scratch off the codes and email them to me as soon as you have them. I'll reimburse you by EOD.

Don't loop in anyone else — this is for a confidential client.

Thanks,
Sundar`,
  },
  {
    id: "legitimate-order-confirmation",
    label: "Legitimate order confirmation",
    description: "A real-looking order confirmation from a recognizable retailer.",
    isPhishing: false,
    body: `From: Amazon.in <auto-confirm@amazon.in>
Subject: Your Amazon.in order #404-1234567-8901234

Hello Rayyan,

Thank you for your order. We'll send a confirmation when your items ship.

Order Total: ₹2,499.00

Items ordered:
- Anker PowerCore 10000 mAh

Shipping to: Bangalore, India
Estimated delivery: Wednesday, 26 March

View or manage your order: https://www.amazon.in/your-orders

This is an automated email. Please do not reply.

© 2026 Amazon.com, Inc. or its affiliates`,
  },
];
