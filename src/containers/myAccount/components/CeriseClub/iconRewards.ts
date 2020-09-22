import rewardpoints from "../../../../images/loyalty/points/rewardpoints.svg";
import redeem from "../../../../images/loyalty/points/redeem.svg";
import specialPreviews from "../../../../images/loyalty/points/specialPreviews.svg";
import customerCare from "../../../../images/loyalty/points/customerCare.svg";
import styling from "../../../../images/loyalty/points/styling.svg";
import gifting from "../../../../images/loyalty/points/gifting.svg";
import invites from "../../../../images/loyalty/points/invites.svg";
import journeys from "../../../../images/loyalty/points/journeys.svg";
import ps from "../../../../images/loyalty/points/ps.svg";

const rewardIcons = [
  {
    iconPath: rewardpoints,
    iconHeader: "Earn Cerise Points",
    description:
      "Get 10% of your purchase value credited into your account as Cerise Points.",
    isCeriseAdv: true,
    ceriseSitara: false,
    key: 1
  },
  {
    iconPath: redeem,
    iconHeader: "Redeem",
    description: "Redeem your Cerise Points any time in-store or online.",
    isCeriseAdv: true,
    ceriseSitara: false,
    key: 2
  },
  {
    iconPath: specialPreviews,
    iconHeader: "Special Previews",
    description:
      "Enjoy special previews of our new collections as they launch.",
    ceriseSitara: false,
    isCeriseAdv: true,
    key: 3
  },
  {
    iconPath: customerCare,
    iconHeader: "Dedicated Customer Care",
    description:
      "Reach out to us on an exclusive number and email id anytime you need assistance.",
    ceriseSitara: false,
    isCeriseAdv: true,
    key: 4
  },
  {
    iconPath: styling,
    iconHeader: "Styling by Appointment",
    description:
      "Enjoy personal styling services twice a year for our apparel brand Sustain.",
    isCeriseAdv: false,
    ceriseSitara: false,
    key: 7
  },
  {
    iconPath: gifting,
    iconHeader: "Exclusive Access to the Good Earth Gifting Concierge",
    description:
      "Let our Gifting Concierge assist you with choosing and sending the most perfect gifts. Also, personalize them if you wish so!",
    isCeriseAdv: false,
    ceriseSitara: false,
    key: 8
  },
  {
    iconPath: invites,
    iconHeader: "Founder Club Event Invites",
    description:
      "Get invited to Good Earth experiential events curated by our founder.",
    isCeriseAdv: false,
    ceriseSitara: false,
    key: 9
  },
  {
    iconPath: journeys,
    iconHeader: "Good Earth Journeys",
    description: "Get access to travel experiences specially curated for you.",
    isCeriseAdv: false,
    ceriseSitara: false,
    key: 10
  },
  {
    iconPath: rewardpoints,
    iconHeader: "Earn Cerise Points",
    description:
      "Get 15% of your purchase value credited into your account as Cerise Points.",
    isCeriseAdv: true,
    ceriseSitara: true,
    key: 11
  },
  {
    iconPath: redeem,
    iconHeader: "Redeem",
    description: "Redeem your Cerise Points any time in-store or online.",
    isCeriseAdv: false,
    ceriseSitara: true,
    key: 13
  },
  {
    iconPath: specialPreviews,
    iconHeader: "Special Previews",
    description:
      "Enjoy special previews of our new collections as they launch.",
    ceriseSitara: true,
    isCeriseAdv: false,
    key: 20
  },
  {
    iconPath: customerCare,
    iconHeader: "Dedicated Customer Care",
    description:
      "Reach out to us on an exclusive number and email id anytime you need assistance.",
    ceriseSitara: true,
    isCeriseAdv: false,
    key: 22
  },
  {
    iconPath: ps,
    iconHeader: "Dedicated Personal Shopper",
    description:
      "Get assistance by your Good Earth Personal Shopper for a faster and more convenient shopping experience.",
    isCeriseAdv: false,
    ceriseSitara: true,
    key: 16
  },
  {
    iconPath: styling,
    iconHeader: "Styling by Appointment",
    description:
      "Enjoy personal styling services twice a year for our apparel brand Sustain.",
    isCeriseAdv: false,
    ceriseSitara: true,
    key: 17
  },
  {
    iconPath: gifting,
    iconHeader: "Exclusive Access to the Good Earth Gifting Concierge",
    description:
      "Let our Gifting Concierge assist you with choosing and sending the most perfect gifts. Also, personalize them if you wish so!",
    isCeriseAdv: false,
    ceriseSitara: true,
    key: 18
  }
];

export default rewardIcons;
