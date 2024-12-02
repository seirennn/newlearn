import { useTheme } from 'next-themes';
import { Shield, Lock, Eye, Database, Server, UserCheck } from 'lucide-react';

const privacyPoints = [
  {
    title: 'Data Protection',
    description: 'Your data is encrypted using industry-standard protocols and stored securely on our servers.',
    icon: Shield,
  },
  {
    title: 'Privacy First',
    description: 'We never share or sell your personal information or learning materials to third parties.',
    icon: Lock,
  },
  {
    title: 'Transparency',
    description: 'Clear and straightforward privacy policies with no hidden terms or conditions.',
    icon: Eye,
  },
  {
    title: 'Data Control',
    description: 'You have full control over your data, including the ability to export or delete it at any time.',
    icon: Database,
  },
  {
    title: 'Secure Infrastructure',
    description: 'Our infrastructure is built on enterprise-grade cloud services with multiple security layers.',
    icon: Server,
  },
  {
    title: 'User Consent',
    description: 'We always ask for your explicit consent before collecting or processing any personal data.',
    icon: UserCheck,
  },
];

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="privacy" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute w-[800px] h-[800px] rounded-full 
          ${isDark ? 'bg-teal-500/10' : 'bg-teal-500/5'} 
          blur-[120px] top-[-400px] right-[-200px]`} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-base font-semibold leading-7 
            ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
            Privacy Policy
          </h2>
          <p className={`mt-2 text-4xl font-bold tracking-tight 
            ${isDark ? 'text-white' : 'text-zinc-900'} sm:text-5xl`}>
            Your privacy matters to us
          </p>
          <p className={`mt-6 text-lg leading-8 
            ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            We are committed to protecting your privacy and ensuring your data is secure. 
            Here's how we maintain your trust.
          </p>
        </div>

        {/* Privacy Points Grid */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {privacyPoints.map((point) => (
              <div
                key={point.title}
                className={`group relative overflow-hidden rounded-3xl 
                  ${isDark 
                    ? 'bg-zinc-900/50 hover:bg-zinc-800/50' 
                    : 'bg-white hover:bg-zinc-50'
                  } p-8 transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-xl 
                  ${isDark 
                    ? 'bg-zinc-800 text-teal-400 ring-1 ring-zinc-700' 
                    : 'bg-white text-teal-600 ring-1 ring-zinc-200 shadow-sm'
                  } transition-all duration-300 group-hover:scale-110`}>
                  <point.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="relative z-10 mt-6">
                  <h3 className={`text-xl font-semibold 
                    ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {point.title}
                  </h3>
                  <p className={`mt-2 text-base leading-7 
                    ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {point.description}
                  </p>
                </div>

                {/* Border Gradient */}
                <div className="absolute inset-0 rounded-3xl transition duration-300">
                  <div className={`absolute inset-[-1px] rounded-3xl ${
                    isDark
                      ? 'bg-gradient-to-b from-zinc-800 via-teal-500/10 to-zinc-800'
                      : 'bg-gradient-to-b from-zinc-200 via-teal-500/10 to-zinc-200'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Policy Link */}
        <div className="mt-16 text-center">
          <a
            href="/full-privacy-policy"
            className={`inline-flex items-center space-x-2 text-sm font-medium 
              ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-500'}`}
          >
            <span>Read our full privacy policy</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
