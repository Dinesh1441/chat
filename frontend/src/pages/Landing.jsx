import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Shield,
  Zap,
  Users,
  Sparkles,
  ArrowRight,
  Globe,
  Star,
  ChevronRight,
  Lock,
  Eye,
  Wifi,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react'

/* ─── Design Tokens ─────────────────────────────────────── */
const PURPLE = '#7C3AED'
const PURPLE_DARK = '#5B21B6'
const PURPLE_LIGHT = '#EDE9FE'
const SURFACE = '#FAFAFA'
const DARK = '#0F0A1E'
const DARK2 = '#1A1030'
const MUTED = '#94A3B8'
const WHITE = '#FFFFFF'

/* ─── Unsplash images (fixed IDs = stable) ──────────────── */
const HERO_IMG   = 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=900&auto=format&fit=crop&q=80'
const AVATAR_1   = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'
const AVATAR_2   = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
const AVATAR_3   = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&auto=format&fit=crop&q=80'
const AVATAR_4   = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80'
const AVATAR_5   = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80'
const AVATAR_6   = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80'
const CHAT_MOCK  = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80'
const GLOBE_IMG  = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&auto=format&fit=crop&q=80'

/* ─── Reusable Styles ────────────────────────────────────── */
const styles = {
  btn: {
    primary: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
      color: WHITE,
      border: 'none',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      boxShadow: `0 4px 24px ${PURPLE}55`,
      textDecoration: 'none',
      '@media (max-width: 640px)': {
        padding: '10px 20px',
        fontSize: '14px',
      }
    },
    ghost: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: 'transparent',
      color: WHITE,
      border: `1.5px solid rgba(255,255,255,0.25)`,
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '15px',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background 0.15s',
      '@media (max-width: 640px)': {
        padding: '10px 20px',
        fontSize: '14px',
      }
    },
    outline: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: 'transparent',
      color: PURPLE,
      border: `1.5px solid ${PURPLE}`,
      borderRadius: '10px',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background 0.15s',
    },
  },
  glass: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  glassLight: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
}

/* ─── Data ───────────────────────────────────────────────── */
const features = [
  {
    icon: Zap,
    label: 'Instant Match',
    desc: 'Get paired with someone new in under 2 seconds. No waiting rooms, no queues.',
    color: '#F59E0B',
  },
  {
    icon: Shield,
    label: 'Zero Identity',
    desc: 'No email, no phone number, no real name — start chatting with one click.',
    color: '#10B981',
  },
  {
    icon: Lock,
    label: 'End-to-End Encrypted',
    desc: 'Every message is encrypted in transit. Not even we can read your conversations.',
    color: '#6366F1',
  },
  {
    icon: Globe,
    label: 'Worldwide Network',
    desc: 'Connect across 190+ countries. Filter by language or keep it serendipitous.',
    color: '#EC4899',
  },
  {
    icon: Eye,
    label: 'No Tracking',
    desc: "We don't log who you talked to or what you said. Your history vanishes after chat.",
    color: '#14B8A6',
  },
  {
    icon: Wifi,
    label: 'Always On',
    desc: '99.9% uptime across distributed infrastructure. Chat whenever inspiration strikes.',
    color: '#F97316',
  },
]

const testimonials = [
  {
    name: 'Alex M.',
    location: 'Berlin, DE',
    avatar: AVATAR_1,
    text: "I've tried every chat app out there. AnonChat is the only one that genuinely feels free. No judgment, no algorithm deciding what I see.",
    stars: 5,
  },
  {
    name: 'Priya S.',
    location: 'Bangalore, IN',
    avatar: AVATAR_2,
    text: 'Had the most thoughtful conversation about philosophy with a complete stranger at 2 AM. Where else does that happen?',
    stars: 5,
  },
  {
    name: 'Jordan T.',
    location: 'Toronto, CA',
    avatar: AVATAR_3,
    text: 'The encryption and anonymity actually work — I checked. This team takes privacy seriously.',
    stars: 5,
  },
  {
    name: 'Lena K.',
    location: 'Amsterdam, NL',
    avatar: AVATAR_4,
    text: "I practice my Dutch with strangers from the Netherlands. Best language exchange tool I've found.",
    stars: 5,
  },
  {
    name: 'Marcus B.',
    location: 'Lagos, NG',
    avatar: AVATAR_5,
    text: 'Clean design, no clutter. Opens instantly. Honestly refreshing compared to everything else.',
    stars: 5,
  },
  {
    name: 'Sophie L.',
    location: 'Paris, FR',
    avatar: AVATAR_6,
    text: 'I was skeptical about anonymous chat but this platform actually has thoughtful people. The community moderation is subtle but real.',
    stars: 5,
  },
]

const stats = [
  { value: '10K+', label: 'Active chatters' },
  { value: '190+', label: 'Countries reached' },
  { value: '2s', label: 'Average match time' },
  { value: '100%', label: 'Anonymous' },
]

const howItWorks = [
  { step: '01', title: 'Open the app', desc: 'No sign-up required. Visit AnonChat and you\'re already inside.' },
  { step: '02', title: 'Set your vibe', desc: 'Choose a topic or language filter — or stay completely open.' },
  { step: '03', title: 'Get matched', desc: 'We pair you with someone in seconds. The conversation is yours.' },
  { step: '04', title: 'Chat freely', desc: 'When you\'re done, close the tab. Nothing stays behind.' },
]

/* ─── Sub-components ─────────────────────────────────────── */
const NavLink = ({ href, children }) => (
  <a
    href={href}
    style={{ 
      color: 'rgba(255,255,255,0.7)', 
      textDecoration: 'none', 
      fontSize: '14px', 
      fontWeight: 500, 
      transition: 'color 0.15s',
      '@media (max-width: 768px)': {
        fontSize: '13px',
      }
    }}
    onMouseEnter={e => (e.target.style.color = WHITE)}
    onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.7)')}
  >
    {children}
  </a>
)

const StarRow = ({ n }) => (
  <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} size={14} fill="#F59E0B" stroke="none" />
    ))}
  </div>
)

const Tag = ({ children, color = PURPLE }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '100px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      background: `${color}22`,
      color: color,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
)

/* ─── Floating chat bubbles (hero decoration) ────────────── */
const ChatBubble = ({ text, side, top, delay, avatar }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{
      position: 'absolute',
      [side]: side === 'left' ? '-10px' : '-10px',
      top: top,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '14px',
      padding: '8px 14px',
      minWidth: '150px',
      maxWidth: '200px',
      flexDirection: side === 'right' ? 'row-reverse' : 'row',
      zIndex: 10,
      '@media (max-width: 768px)': {
        display: 'none',
      }
    }}
  >
    <img
      src={avatar}
      alt=""
      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
    <span style={{ fontSize: '12px', color: WHITE, lineHeight: 1.4 }}>{text}</span>
  </motion.div>
)

/* ─── Main Component ─────────────────────────────────────── */
const Landing = () => {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: DARK,
        color: WHITE,
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* ── Ambient BG ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            background: `radial-gradient(circle, ${PURPLE}30 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, #EC489930 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          ...styles.glass,
          padding: '0 4vw',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '@media (max-width: 768px)': {
            padding: '0 16px',
            height: '60px',
          }
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${PURPLE}, #EC4899)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageCircle size={16} color={WHITE} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>AnonChat</span>
        </div>

        {/* Desktop nav */}
        <div style={{ 
          display: `${isMobile ? 'none' : 'flex'}`, 
          gap: '24px', 
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: 'none',
          }
        }}>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#testimonials">Stories</NavLink>
        </div>

        {/* CTA - Only Login link */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{ 
            ...styles.btn.ghost, 
            padding: '8px 16px', 
            fontSize: '13px',
            '@media (max-width: 768px)': {
              padding: '6px 12px',
              fontSize: '12px',
            }
          }}>
            Log in
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: WHITE,
              cursor: 'pointer',
              padding: '4px',
              '@media (max-width: 768px)': {
                display: 'flex',
              }
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              ...styles.glass,
              padding: '16px',
              display: 'none',
              '@media (max-width: 768px)': {
                display: 'block',
                position: 'sticky',
                top: '60px',
                zIndex: 99,
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#features" style={{ color: WHITE, textDecoration: 'none', padding: '8px 0', fontSize: '14px' }}>Features</a>
              <a href="#how" style={{ color: WHITE, textDecoration: 'none', padding: '8px 0', fontSize: '14px' }}>How it works</a>
              <a href="#testimonials" style={{ color: WHITE, textDecoration: 'none', padding: '8px 0', fontSize: '14px' }}>Stories</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 4vw 40px',
          display: `${isMobile ? 'flex' : 'grid'}`,
          flexDirection: 'column-reverse',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          '@media (max-width: 968px)': {
            display: 'flex !important',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 4vw 30px',
          }
        }}
      >
        {/* Left copy */}
        <motion.div style={{ y: heroY }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tag>✦ Anonymous · Encrypted · Free</Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: '20px 0 16px',
              background: `linear-gradient(135deg, ${WHITE} 40%, ${PURPLE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Talk to the world.
            <br />
            Leave no trace.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ 
              fontSize: 'clamp(16px, 1.2vw, 18px)', 
              color: MUTED, 
              lineHeight: 1.7, 
              marginBottom: '28px', 
              maxWidth: '440px',
              '@media (max-width: 768px)': {
                fontSize: '15px',
              }
            }}
          >
            AnonChat pairs you with real people across the globe in seconds — no account, no history, no data stored.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ 
              display: 'flex', 
              gap: '12px', 
              flexWrap: 'wrap', 
              marginBottom: '32px',
              '@media (max-width: 480px)': {
                flexDirection: 'column',
                width: '100%',
              }
            }}
          >
            <Link to="/login" style={{
              ...styles.btn.primary,
              '@media (max-width: 480px)': {
                width: '100%',
                justifyContent: 'center',
              }
            }}>
              Start chatting <ArrowRight size={16} />
            </Link>
            <a href="#how" style={{
              ...styles.btn.ghost,
              '@media (max-width: 480px)': {
                width: '100%',
                justifyContent: 'center',
              }
            }}>
              See how it works
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              '@media (max-width: 480px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }
            }}
          >
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 800, color: WHITE }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: MUTED, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — hero image with overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ position: 'relative' }}
        >
          {/* Main image */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)`,
              position: 'relative',
            }}
          >
            <img
              src={HERO_IMG}
              alt="Two people connecting via chat"
              style={{ 
                width: '100%', 
                height: 'clamp(280px, 30vw, 420px)', 
                objectFit: 'cover', 
                display: 'block' 
              }}
            />
            {/* Gradient overlay on image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(15,10,30,0.9) 100%)',
              }}
            />
          </div>

          {/* Floating chat bubbles - hidden on mobile */}
          <ChatBubble text="Hey, where are you from? 👋" side="left" top="12%" delay={0.8} avatar={AVATAR_1} />
          <ChatBubble text="Berlin! First time here" side="right" top="35%" delay={1.1} avatar={AVATAR_3} />
          <ChatBubble text="This is actually fun 😄" side="left" top="58%" delay={1.4} avatar={AVATAR_2} />

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            style={{
              position: 'absolute',
              bottom: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(10,10,20,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(12px)',
              '@media (max-width: 480px)': {
                padding: '4px 12px',
                fontSize: '11px',
                bottom: '-10px',
              }
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: 'clamp(11px, 1vw, 13px)', fontWeight: 600 }}>
              {isMobile ? '2,847 online' : '2,847 people chatting right now'}
            </span>
          </motion.div>

          <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 4vw 60px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <Tag>Features</Tag>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              margin: '16px 0 12px',
            }}
          >
            Built for real privacy
          </h2>
          <p style={{ 
            color: MUTED, 
            fontSize: 'clamp(15px, 1.2vw, 18px)', 
            maxWidth: '480px', 
            margin: '0 auto',
            padding: '0 16px'
          }}>
            Every design decision starts with one question: does this protect the user?
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            '@media (max-width: 480px)': {
              gridTemplateColumns: '1fr',
            }
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                ...styles.glass,
                borderRadius: '16px',
                padding: '24px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              whileHover={{ y: -4 }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${f.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{f.label}</h3>
              <p style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '60px 4vw',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: `${isMobile ? 'block' : 'grid'}`, 
          flexDirection: 'column',
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          
          '@media (max-width: 968px)': {
            gridTemplateColumns: '1fr',
            gap: '40px',
          }
        }}>
          {/* Left: steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              marginBottom: '40px',
            }}
          >
            <Tag>How it works</Tag>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                margin: '16px 0 32px',
              }}
            >
              Chat in under 30 seconds
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {howItWorks.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${PURPLE}22`,
                      border: `1px solid ${PURPLE}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: PURPLE,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/login" style={{ 
              ...styles.btn.primary, 
              marginTop: '32px', 
              display: 'inline-flex',
              '@media (max-width: 480px)': {
                width: '100%',
                justifyContent: 'center',
              }
            }}>
              Try it now — it's free <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right: two stacked images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
            <div style={{ 
              position: 'relative', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)' 
            }}>
              <img
                src={CHAT_MOCK}
                alt="Chat interface on phone"
                style={{ 
                  width: '100%', 
                  height: 'clamp(240px, 30vw, 360px)', 
                  objectFit: 'cover', 
                  display: 'block' 
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${PURPLE}55 0%, transparent 60%)` }} />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-16px',
                right: '-16px',
                width: 'clamp(140px, 15vw, 200px)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.12)',
                '@media (max-width: 480px)': {
                  bottom: '-10px',
                  right: '-10px',
                  width: '120px',
                }
              }}
            >
              <img
                src={GLOBE_IMG}
                alt="World connections"
                style={{ 
                  width: '100%', 
                  height: 'clamp(100px, 12vw, 140px)', 
                  objectFit: 'cover', 
                  display: 'block' 
                }}
              />
              <div
                style={{
                  background: DARK2,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={12} color="#10B981" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>
                  {isMobile ? '190+ countries' : '190+ countries online'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 4vw 60px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <Tag>Community stories</Tag>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              margin: '16px 0 12px',
            }}
          >
            Real people, real moments
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            '@media (max-width: 480px)': {
              gridTemplateColumns: '1fr',
            }
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                ...styles.glass,
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <StarRow n={t.stars} />
              <p style={{ 
                color: 'rgba(255,255,255,0.85)', 
                fontSize: 'clamp(14px, 1vw, 15px)', 
                lineHeight: 1.6, 
                marginBottom: '20px' 
              }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                  <div style={{ color: MUTED, fontSize: '12px' }}>{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ 
        position: 'relative', 
        zIndex: 1, 
        maxWidth: '1200px', 
        margin: '0 auto 80px', 
        padding: '0 4vw' 
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '24px',
            padding: 'clamp(32px, 5vw, 64px)',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${PURPLE_DARK}cc, #1e1038cc)`,
            border: `1px solid ${PURPLE}44`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '400px',
              height: '250px',
              background: `radial-gradient(ellipse, ${PURPLE}40 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            {/* Avatars cluster */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
              {[AVATAR_1, AVATAR_2, AVATAR_3, AVATAR_4, AVATAR_5].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: 'clamp(36px, 4vw, 44px)',
                    height: 'clamp(36px, 4vw, 44px)',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${DARK}`,
                    marginLeft: i === 0 ? 0 : '-10px',
                  }}
                />
              ))}
              <div
                style={{
                  width: 'clamp(36px, 4vw, 44px)',
                  height: 'clamp(36px, 4vw, 44px)',
                  borderRadius: '50%',
                  background: PURPLE,
                  border: `2px solid ${DARK}`,
                  marginLeft: '-10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                10K+
              </div>
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                marginBottom: '12px',
              }}
            >
              Your next great conversation
              <br />
              is one click away.
            </h2>

            <p style={{ 
              color: 'rgba(255,255,255,0.65)', 
              fontSize: 'clamp(15px, 1.2vw, 17px)', 
              marginBottom: '28px',
              padding: '0 16px'
            }}>
              No sign-up. No credit card. No data stored. Just conversations.
            </p>

            <Link to="/login" style={{ 
              ...styles.btn.primary, 
              fontSize: 'clamp(15px, 1vw, 17px)', 
              padding: '14px 32px',
              '@media (max-width: 480px)': {
                width: '100%',
                justifyContent: 'center',
              }
            }}>
              <Sparkles size={18} />
              Start chatting free
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '32px 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            textAlign: 'center',
            gap: '12px',
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${PURPLE}, #EC4899)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageCircle size={12} color={WHITE} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>AnonChat</span>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px',
          '@media (max-width: 480px)': {
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }
        }}>
          {['Privacy', 'Terms', 'Safety', 'Contact'].map(label => (
            <a
              key={label}
              href="#"
              style={{ 
                color: MUTED, 
                textDecoration: 'none', 
                fontSize: '12px', 
                transition: 'color 0.15s' 
              }}
              onMouseEnter={e => (e.target.style.color = WHITE)}
              onMouseLeave={e => (e.target.style.color = MUTED)}
            >
              {label}
            </a>
          ))}
        </div>

        <span style={{ color: MUTED, fontSize: '12px' }}>© 2025 AnonChat. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default Landing