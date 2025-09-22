// src/components/footer.tsx
import React from "react";

const LinkItem = ({ children }: { children: React.ReactNode }) => (
  <li className="mb-2"><a href="#" className="hover:underline">{children}</a></li>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="mb-2 font-medium text-gray-900">{title}</h4>
    <ul className="text-gray-600">{children}</ul>
  </div>
);

export default function Footer(): React.ReactElement {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#f5f5f7] text-xs text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">

        {/* Disclaimers (puro texto) */}
        <div className="space-y-3 leading-relaxed">
          <p>
            1. Offer valid on qualifying purchases of eligible Apple products from November 25, 2022, to November 28, 2022, at a qualifying location. Offer subject to availability. Other restrictions may apply.
          </p>
          <p>
            To access and use all the features of Apple Card, you must add Apple Card to Wallet on an iPhone or iPad with the latest version of iOS or iPadOS. Available for qualifying applicants in the United States.
          </p>
          <p>
            Learn more about how Apple Card applications are evaluated at <a href="#" className="underline">support.apple.com/kb/HT209218</a>.
          </p>
        </div>

        <hr className="my-5 border-gray-300" />

        {/* Columnas de enlaces (enlaces vacíos) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8">
          <Section title="Shop and Learn">
            <LinkItem>Store</LinkItem>
            <LinkItem>Mac</LinkItem>
            <LinkItem>iPad</LinkItem>
            <LinkItem>iPhone</LinkItem>
            <LinkItem>Watch</LinkItem>
            <LinkItem>AirPods</LinkItem>
            <LinkItem>TV &amp; Home</LinkItem>
            <LinkItem>AirTag</LinkItem>
            <LinkItem>Accessories</LinkItem>
            <LinkItem>Gift Cards</LinkItem>
          </Section>

          <Section title="Services">
            <LinkItem>Apple Music</LinkItem>
            <LinkItem>Apple TV+</LinkItem>
            <LinkItem>Apple Fitness+</LinkItem>
            <LinkItem>Apple News+</LinkItem>
            <LinkItem>Apple Arcade</LinkItem>
            <LinkItem>iCloud</LinkItem>
            <LinkItem>Apple One</LinkItem>
            <LinkItem>Apple Card</LinkItem>
            <LinkItem>Apple Books</LinkItem>
            <LinkItem>Apple Podcasts</LinkItem>
            <LinkItem>App Store</LinkItem>
          </Section>

          <Section title="Apple Store">
            <LinkItem>Find a Store</LinkItem>
            <LinkItem>Genius Bar</LinkItem>
            <LinkItem>Today at Apple</LinkItem>
            <LinkItem>Apple Camp</LinkItem>
            <LinkItem>Apple Store App</LinkItem>
            <LinkItem>Refurbished and Clearance</LinkItem>
            <LinkItem>Financing</LinkItem>
            <LinkItem>Apple Trade In</LinkItem>
            <LinkItem>Order Status</LinkItem>
            <LinkItem>Shopping Help</LinkItem>
          </Section>

          <Section title="For Business">
            <LinkItem>Apple and Business</LinkItem>
            <LinkItem>Shop for Business</LinkItem>
          </Section>

          <Section title="For Education">
            <LinkItem>Apple and Education</LinkItem>
            <LinkItem>Shop for K-12</LinkItem>
            <LinkItem>Shop for College</LinkItem>
          </Section>

          <Section title="For Healthcare">
            <LinkItem>Apple in Healthcare</LinkItem>
            <LinkItem>Health on Apple Watch</LinkItem>
            <LinkItem>Health Records on iPhone</LinkItem>
          </Section>

          <Section title="For Government">
            <LinkItem>Shop for Government</LinkItem>
            <LinkItem>Shop for Veterans and Military</LinkItem>
          </Section>

          <Section title="Apple Values">
            <LinkItem>Accessibility</LinkItem>
            <LinkItem>Education</LinkItem>
            <LinkItem>Environment</LinkItem>
            <LinkItem>Inclusion and Diversity</LinkItem>
            <LinkItem>Privacy</LinkItem>
            <LinkItem>Racial Equity and Justice</LinkItem>
            <LinkItem>Supplier Responsibility</LinkItem>
          </Section>

          <Section title="About Apple">
            <LinkItem>Newsroom</LinkItem>
            <LinkItem>Apple Leadership</LinkItem>
            <LinkItem>Career Opportunities</LinkItem>
            <LinkItem>Investors</LinkItem>
            <LinkItem>Ethics &amp; Compliance</LinkItem>
            <LinkItem>Events</LinkItem>
            <LinkItem>Contact Apple</LinkItem>
          </Section>

          <Section title="Account">
            <LinkItem>Manage Your Apple ID</LinkItem>
            <LinkItem>Apple Store Account</LinkItem>
            <LinkItem>iCloud.com</LinkItem>
          </Section>
        </div>

        <hr className="my-5 border-gray-300" />

        {/* More ways to shop */}
        <p className="text-gray-700">
          More ways to shop: <a className="text-[#2997FF] hover:underline" href="#">Find an Apple Store</a> or <a className="text-[#2997FF] hover:underline" href="#">other retailer</a> near you. Or call 1-800-MY-APPLE.
        </p>

        <hr className="my-5 border-gray-300" />

        {/* Franja legal final */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-8">
          <div className="text-gray-600">
            © {year} Apple Inc. All rights reserved.
          </div>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <span className="text-gray-400">|</span>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <span className="text-gray-400">|</span>
            <li><a href="#" className="hover:underline">Sales and Refunds</a></li>
            <span className="text-gray-400">|</span>
            <li><a href="#" className="hover:underline">Legal</a></li>
            <span className="text-gray-400">|</span>
            <li><a href="#" className="hover:underline">Site Map</a></li>
          </ul>
          <div className="text-gray-600">United States</div>
        </div>
      </div>
    </footer>
  );
}
