import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

/** Same legal content as the original template, restyled. */
const PrivacyPolicy = () => (
  <main className="min-h-screen bg-cream">
    <Helmet>
      <title>Privacy Policy &amp; Terms of Use</title>
      <meta name="robots" content="noindex, follow" />
    </Helmet>

    <div className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-stone transition hover:text-gold-deep"
        >
          <ArrowLeft size={16} /> Back to Property
        </Link>
      </div>
    </div>

    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="eyebrow mb-4">Legal</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
        Privacy Policy &amp; Terms of Use
      </h1>

      <div className="prose-luxe mt-10">
        <p>
          Buy India Homes Digital Pvt Ltd (&quot;Buy India Homes Digital&quot; or
          &quot;We&quot;) is a registered agent under the Real Estate Regulatory
          Authority (MAHARERA) with RERA No: A52100019166. Your privacy is our
          priority. This Privacy Policy provides an overview of the personal
          information we collect through our website, including sub-domains and
          microsites, the purposes for which we collect it, how we may share it,
          and the security measures we implement. It also outlines your rights,
          choices, and how to contact us with any privacy concerns. We encourage
          you to read this Privacy Policy before using our services or providing
          any personal information.
        </p>

        <h2>Interpretations and Definitions</h2>
        <ul>
          <li>
            <strong>Data:</strong> Refers to personal information, including
            sensitive personal data and special category data, as defined by
            applicable Data Protection Laws, that we collect or process in
            relation to your use of our website and/or Platform.
          </li>
          <li>
            <strong>Data Protection Laws:</strong> Any laws currently in force
            relating to the processing of Data.
          </li>
          <li>
            <strong>Service Providers:</strong> Entities that provide services to
            us, with whom we may share your Data under a written agreement for
            specific purposes.
          </li>
          <li>
            <strong>Buy India Homes Digital/We:</strong> Refers to Buy India
            Homes Digital Pvt Ltd and its subsidiaries, affiliates, and associate
            companies.
          </li>
          <li>
            <strong>User or You:</strong> Refers to the natural person who
            accesses our website/pages or Platform.
          </li>
        </ul>

        <h2>Website Content Overview</h2>
        <p>
          The contents of this landing page, containing details of properties,
          property photos, costs, and availability, are provided for
          informational and illustrative purposes only. This information is
          subject to change at any time. Users are hereby advised that the
          actual properties may differ from what is shown in photos and costs on
          the website and pages, and as such, no claims shall be entertained
          based on such representations.
        </p>

        <h2>Types of Data Collected</h2>
        <p>
          While visiting this website, we may ask you to provide certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
        </ul>

        <h2>Uses of Personal Data</h2>
        <ul>
          <li>To provide and maintain our Service, including monitoring usage.</li>
          <li>
            To contact you via email, phone, SMS, or other forms of electronic
            communication.
          </li>
          <li>
            To provide information related to property sales, special offers,
            and general information about our real estate services.
          </li>
          <li>To manage your requests.</li>
        </ul>

        <h2>Retention of Your Personal Data</h2>
        <p>
          We shall retain your Personal Data only as long as necessary for the
          purposes set out in this Privacy Policy.
        </p>

        <h2>Disclosure of Your Personal Data</h2>
        <p>
          By using this website, you consent to the collection and use of your
          information in accordance with this Privacy Policy.
        </p>

        <h2>Security of Your Personal Data</h2>
        <p>
          The security of your Personal Data is important to us, but no method
          of transmission over the Internet is 100% secure.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our service does not address anyone under the age of 18. We do not
          knowingly collect personally identifiable information from anyone
          under 18.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time and will notify you
          by posting the new policy here.
        </p>

        <h2>Contact Us</h2>
        <p>
          To review, update, or delete your personal information, please contact
          us at <a href="mailto:info@buyindiahomes.com">info@buyindiahomes.com</a>.
        </p>
      </div>

      <p className="mt-12 border-t border-line pt-6 text-sm text-stone">
        &copy; {new Date().getFullYear()} Buy India Homes Digital Pvt Ltd
      </p>
    </article>
  </main>
);

export default PrivacyPolicy;
