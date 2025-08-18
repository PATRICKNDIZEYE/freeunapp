import Link from "next/link"
import { GraduationCap, Mail, MapPin, Phone, ExternalLink, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FreeUnApp</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-6">
              We're on a mission to democratize education by connecting students with scholarship opportunities that can transform their academic journey.
            </p>
            <div className="flex items-center gap-6">
              <a href="mailto:info@freeunapp.org" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@freeunapp.org</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+250 798 434 426</span>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Platform</h3>
            <div className="space-y-4">
              <Link href="/scholarships" className="block text-slate-400 hover:text-white transition-colors">
                Find Scholarships
              </Link>
              <Link href="/universities" className="block text-slate-400 hover:text-white transition-colors">
                Universities
              </Link>
              <Link href="/programs" className="block text-slate-400 hover:text-white transition-colors">
                Study Programs
              </Link>
              <Link href="/success-stories" className="block text-slate-400 hover:text-white transition-colors">
                Success Stories
              </Link>
              <Link href="/blog" className="block text-slate-400 hover:text-white transition-colors">
                Blog & Tips
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <div className="space-y-4">
              <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/careers" className="block text-slate-400 hover:text-white transition-colors">
                Join Our Team
              </Link>
              <Link href="/partners" className="block text-slate-400 hover:text-white transition-colors">
                Partners
              </Link>
              <Link href="/press" className="block text-slate-400 hover:text-white transition-colors">
                Press Kit
              </Link>
              <Link href="/contact" className="block text-slate-400 hover:text-white transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© 2025 FreeUnApp, Inc.</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}