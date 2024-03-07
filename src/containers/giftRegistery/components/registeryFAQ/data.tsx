import React from "react";
import { ReactComponent as Estimate } from "images/inline/estimate.svg";
import { ReactComponent as EstimateAqua } from "images/inline/estimate_aqua.svg";

export const faqs = [
  {
    text: "Estimating your requirements",
    icon: <Estimate />,
    iconAqua: <EstimateAqua />,
    questions: [
      {
        ques: "1. What is a bridal/wedding/gift registry?",
        answer: (
          <>
            A bridal/wedding/gift registry is a service that lets you curate a
            wishlist of presents that will add value and joy to your life. You
            can then share this with friends and loved ones to make their
            gifting process easier and more cherished. 
          </>
        )
      },
      {
        ques: "2. How do I create my Good Earth Registry?",
        answer: (
          <>
            - To create your registry, sign up/log in to Good Earth. <br />
            - Go to the MY ACCOUNT icon on the top right corner, and click on
            Bridal Registry. <br />
            - Next, choose an option – Wedding or Special Occasion – for which
            you want the registry. (Please note you can only create one active
            registry at a time.) <br />- Proceed to set date, and then enter
            name and shipping details. <br />
            After this, your registry will be created and you can add products
            to it.  
          </>
        )
      },
      {
        ques:
          "3. Can I update my profile details entered upon creating my registry?",
        answer: (
          <>
            You can edit the name of the registry, registrant and co-registrant
            at any time. But once submitted, the email address provided by you
            cannot be changed. You can make changes to the shipping address but
            change in country may result in change of pricing of the products in
            your registry catalogue
          </>
        )
      },
      {
        ques: "4. Can I create a registry in-store too?",
        answer: (
          <>
            The Good Earth Registry is an online-based service and is valid only
            on our web boutique. For any assistance, please feel free to reach
            out to us at customercare@goodearth.in
          </>
        )
      },
      {
        ques: "5. How do I let my guests know about my registry?",
        answer: (
          <>
            For an existing registry, go to My Account &gt; Bridal Registry &gt;
            Manage Registry and click on ‘Share Link’. For first time users,
            once your registry is created, there will be a link generated which
            you can copy-paste and share with friends & family via email or
            whatsapp (on mobile).
          </>
        )
      },
      {
        ques: "6. How do I manage my registry?",
        answer: (
          <>
            Once your Good Earth Registry is created, it cannot be deleted.
            However, you can make changes to the date, product quantities and
            styles. Please note that once a single quantity of the desired
            product from your registry is purchased, you will not be able to
            delete the purchased item. However, items can be deleted before they
            are purchased.
          </>
        )
      },
      {
        ques: "7. Are there products that cannot be added to a registry?",
        answer: (
          <>
            Most items can be added to registry. However, e-gift cards and
            products marked as ‘pre-order’ cannot be added to registries at this
            time.
          </>
        )
      },
      {
        ques: "8. Can I return/exchange the gifts purchased from my registry?",
        answer: (
          <>
            Please follow our policies for shipping, in case you’d like to make
            a return/exchange; CLICK HERE
          </>
        )
      },
      {
        ques: "9. How do I find my registry on the Good Earth web boutique?",
        answer: (
          <>
            Once you log in to your Good Earth account, go to the My Account
            icon on the top right corner where you’ll find an option titled
            ‘Bridal Registry’ which will have all your registry details.
          </>
        )
      },
      {
        ques:
          "10. Can I get personalised recommendations or one-on-one consultation for my registry?",
        answer: (
          <>
            Our stylists would be more than happy to help you. Please feel free
            to write to us at customercare@goodearth.in for assistance.
          </>
        )
      },
      {
        ques: "11. Will my registry reflect purchase details?",
        answer: (
          <>
            The details on products purchased from your registry are updated and
            reflected within minutes. However, you cannot check who the
            purchaser is. If you would like details on the same, you can reach
            out to our customer support at customercare@goodearth.in
          </>
        )
      }
    ]
  }
];
