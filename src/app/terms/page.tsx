'use client';

import LegalLayout from '@/components/legal/LegalLayout';
import { useTheme } from '@/components/landing/theme-context';

export default function TermsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <LegalLayout>
      <div className="space-y-8"  style={{ zoom: '80%' }}>
        {/* Header */}
        <div className="space-y-4">
          <h1 className={`text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Terms of Use
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
              'Acceptance of Terms',
              'Description of Service',
              'User Accounts',
              'User Content',
              'Intellectual Property',
              'Prohibited Activities',
              'Termination',
              'Changes to Terms',
              'Contact Information'
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
          <section id="acceptance-of-terms">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              1. Acceptance of Terms
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              By accessing and using LearnFlow (&quot;the Service&quot;), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section id="description-of-service">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              2. Description of Service
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              LearnFlow is an AI-powered learning platform that transforms content into interactive learning experiences. The Service includes features such as flashcards, quizzes, and personalized learning paths.
            </p>
          </section>

          <section id="user-accounts">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              3. User Accounts
            </h2>
            <div className={`space-y-4 text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p>To access certain features of the Service, you must create an account. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section id="user-content">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              4. User Content
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              By submitting content to the Service, you grant LearnFlow a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content for the purpose of providing and improving the Service.
            </p>
          </section>

          <section id="intellectual-property">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              5. Intellectual Property
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              All content, features, and functionality of the Service are owned by LearnFlow and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section id="prohibited-activities">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              6. Prohibited Activities
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Users are prohibited from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using the Service for any illegal purpose</li>
              <li>Attempting to gain unauthorized access to the Service</li>
              <li>Interfering with or disrupting the Service</li>
              <li>Collecting user information without consent</li>
            </ul>
          </section>

          <section id="termination">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              7. Termination
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Use or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section id="changes-to-terms">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              8. Changes to Terms
            </h2>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Continued use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section id="contact-information">
            <h2 className={`text-2xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              9. Contact Information
            </h2>
            <div className={`space-y-4 ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p>For questions about these Terms of Use, please contact us at:</p>
              <div className={`rounded-lg border ${
                isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
              } p-4`}>
                <p className="font-mono">lansojordan@gmail.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
}
