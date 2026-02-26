/**
 * @file apps/web/src/widgets/footer/ui/Footer.tsx
 * @summary footer component.
 * @description footer widget component.
 */

export interface FooterProps {
  companyName: string
  socialLinks?: {
    name: string
    href: string
    icon: string
  }[]
}

export function Footer({ companyName, socialLinks = [] }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
            <p className="text-gray-300">
              Building powerful marketing websites for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white">About</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-300">
            © 2026 {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
