'use client';

import LegalLayout from '@/components/legal/LegalLayout';
import { useTheme } from '@/components/landing/theme-context';

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <LegalLayout>
      <div className="space-y-8 " style={{ zoom: '80%' }}>
        {/* Header */}
        <div className="space-y-4">
          <h1 className={`text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Privacy Policy
          </h1>
          <div className="flex items-center space-x-4">
            <p className={`text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Last updated: December 5, 2023
            </p>
            <div className={`h-1 w-1 rounded-full ${
              isDark ? 'bg-zinc-700' : 'bg-zinc-300'
            }`} />
            <p className={`text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Version 1.0
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className={`rounded-xl border ${
          isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white/50'
        } p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Table of Contents
          </h2>
          <nav className="space-y-2">
            {[
              'Introduction',
              'Information We Collect',
              'How We Use Your Information',
              'Information Sharing',
              'Data Security',
              'Your Rights',
              "Children's Privacy",
              'Changes to Privacy Policy',
              'Contact Us'
            ].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`block text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-black'
                } transition-colors`}
              >
                {index + 1}. {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section id="introduction">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              1. Introduction
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              LearnFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section id="information-we-collect">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              2. Information We Collect
            </h2>
            <div className={`space-y-6 ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <div className="space-y-4">
                <h3 className={`text-xl font-medium ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  2.1 Personal Information
                </h3>
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Profile information</li>
                  <li>Learning preferences and history</li>
                  <li>Content you create or upload</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className={`text-xl font-medium ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  2.2 Automatically Collected Information
                </h3>
                <p>When you use our Service, we automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="how-we-use-your-information">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              3. How We Use Your Information
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Personalize your learning experience</li>
              <li>Improve our Service and develop new features</li>
              <li>Communicate with you about updates and changes</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section id="information-sharing">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              4. Information Sharing
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist in operating our platform</li>
              <li>Analytics partners to improve our Service</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section id="data-security">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              5. Data Security
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section id="your-rights">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              6. Your Rights
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section id="childrens-privacy">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              7. Children&apos;s Privacy
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section id="changes-to-privacy-policy">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              8. Changes to Privacy Policy
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section id="contact-us">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              9. Contact Us
            </h2>
            <div className={`space-y-4 ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <div className={`rounded-lg border ${
                isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
              } p-6 space-y-4`}>
                <div>
                  <p className="text-sm font-medium mb-2">Email</p>
                  <p className="font-mono">lansojordan@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Address</p>
                  <p className="font-mono">LearnFlow (not even a registered company lol)<br />Assam Down Town University🤣<br />Guwahati, India 781026</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
}
