export const DEMO_CUSTOMER_ID = "customer-lara-weber";

export function createSeedAccount() {
  return {
    customer: {
      id: DEMO_CUSTOMER_ID,
      displayName: "Lara Weber",
      firstName: "Lara",
      customerNumber: "KD-4902-1187",
      city: "München",
      authenticated: true,
      memberSince: "2021-03-12",
    },
    mobilePlan: {
      id: "mobile-plan-l",
      name: "Connect Mobile L",
      monthlyPrice: 39.95,
      includedDataGb: 40,
      usedDataGb: 22,
      remainingDataGb: 18,
      network: "5G",
      maskedPhoneNumber: "+49 171 *** 4821",
      contractRenewalDate: "2027-03-31",
      activeAddOns: [],
    },
    homeInternet: {
      id: "home-internet-l",
      planName: "Connect Internet",
      monthlyPrice: 30,
      advertisedSpeedMbps: 100,
      currentSpeedMbps: 12,
      serviceAddressLabel: "München-Schwabing",
      connectionStatus: "degraded",
      diagnosticScenario: "local_outage",
      estimatedRestoration: "16:30",
      restorationNotificationRequested: false,
      router: "Connect Router",
    },
    billing: {
      currency: "EUR",
      previousBillTotal: 69.95,
      currentBillTotal: 87.95,
      dueDate: "2026-08-27",
      billingPeriod: "2026-08",
      lineItems: [
        { id: "mobile-base", type: "mobile", amount: 39.95 },
        { id: "internet-base", type: "internet", amount: 30 },
        { id: "swiss-roaming", type: "swiss_roaming", amount: 18 },
      ],
      roamingCharges: [
        {
          id: "roaming-ch-august",
          country: "Switzerland",
          countryCode: "CH",
          amount: 18,
          dataUsedMb: 360,
          date: "2026-08-11",
        },
      ],
    },
    devices: [
      {
        id: "device-iphone",
        deviceName: "iPhone 16 Pro",
        deviceType: "smartphone",
        linkedSimId: "sim-main",
      },
      {
        id: "device-watch",
        deviceName: "Apple Watch Series 10",
        deviceType: "wearable",
        linkedSimId: "sim-watch",
      },
    ],
    simCards: [
      {
        id: "sim-main",
        label: "iPhone 16 Pro",
        maskedPhoneNumber: "+49 171 *** 4821",
        type: "eSIM",
        status: "active",
      },
      {
        id: "sim-watch",
        label: "Apple Watch",
        maskedPhoneNumber: "+49 171 *** 4822",
        type: "MultiSIM",
        status: "active",
      },
    ],
    availableOffers: {
      switzerlandTravelPass: {
        id: "switzerland-pass",
        name: "Schweiz Travel Pass",
        price: 9.95,
        durationDays: 7,
        includedDataGb: 3,
        country: "Switzerland",
      },
      mobileDataAddOn: {
        id: "data-boost-5gb",
        name: "Data Boost 5 GB",
        price: 7.95,
        dataGb: 5,
        durationDays: 30,
      },
      alternativePlans: [
        { id: "plan-s", name: "Connect Mobile S", dataGb: 20, monthlyPrice: 29.95 },
        { id: "plan-l", name: "Connect Mobile L", dataGb: 40, monthlyPrice: 39.95 },
        { id: "plan-xl", name: "Connect Mobile XL", dataGb: 80, monthlyPrice: 49.95 },
      ],
    },
    auditEvents: [
      {
        id: "seed-event-bill",
        action: "bill_created",
        outcome: "success",
        timestamp: "2026-08-16T08:15:00.000Z",
        description: {
          de: "Augustrechnung erstellt",
          en: "August bill generated",
        },
      },
      {
        id: "seed-event-network",
        action: "network_detected",
        outcome: "attention",
        timestamp: "2026-08-17T07:42:00.000Z",
        description: {
          de: "Regionale Netzstörung erkannt",
          en: "Regional network issue detected",
        },
      },
    ],
  };
}
