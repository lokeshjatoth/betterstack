export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'API']
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact', 'Press Kit']
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'Community', 'Status Page', 'Security']
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR', 'DPA']
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">BetterStack</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Monitor your infrastructure with confidence. Built for teams that ship fast.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 BetterStack. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
