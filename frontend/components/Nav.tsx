'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Live Demo' },
  { href: '/results', label: 'Results' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-bg/80">
      <Link href="/" className="flex items-center gap-3">
        <div
          className="w-9 h-9 hex-pulse"
          style={{
            background: 'linear-gradient(135deg,#00e5ff,#0077aa)',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          }}
        />
        <div>
          <p className="font-bold text-sm tracking-tight">PhishGuard AI</p>
          <p className="font-mono text-[10px] text-accent tracking-widest">RESEARCH DEMO</p>
        </div>
      </Link>
      <div className="flex items-center gap-1">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${
              path === href ? 'text-accent' : 'text-muted hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/demo"
          className="ml-2 px-4 py-2 text-sm font-bold bg-accent text-bg rounded hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          Try Demo <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  )
}
