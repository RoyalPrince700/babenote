import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AppIcon from './AppIcon'

const navLinks = [
  { href: '#story', label: 'Our Story' },
  { href: '#memories', label: 'Memories' },
  { href: '#bond', label: 'Our Bond' },
  { href: '#letter', label: 'Love Letter' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <a href="#" className="navbar__logo">
        <motion.span
          className="navbar__heart"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AppIcon name="heart" size={18} />
        </motion.span>
        For You
      </a>

      <button
        className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={handleNavClick}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
