import { createContext, useContext, useEffect, useRef, useState } from 'react'

// Context cung cấp hàm mở lightbox cho mọi <Img zoomable>
const LightboxContext = createContext(null)

// ---------------------------------------------------------------------------
// Img — thử lần lượt các đuôi file nếu đường dẫn không có đuôi, fallback placehold.
// Cho phép dán URL ngoài trực tiếp (http...).
// ---------------------------------------------------------------------------
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']

// Ảnh dự phòng nội bộ (data URI) — không gọi domain ngoài nào
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#11617C"/><text x="50%" y="50%" fill="#C6A24B" font-family="Georgia,serif" font-size="42" text-anchor="middle" dominant-baseline="middle">Hiệp Phước Premia</text></svg>'
  )

function Img({ src, alt = '', className = '', zoomable = true, ...rest }) {
  const isExternal = /^https?:\/\//i.test(src || '')
  const hasExt = /\.[a-z0-9]+$/i.test(src || '')
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const openLightbox = useContext(LightboxContext)

  let resolved
  if (!src) resolved = FALLBACK_IMG
  else if (isExternal || hasExt) resolved = src
  else resolved = `${src}${EXTS[idx]}`

  const handleError = () => {
    if (!isExternal && !hasExt && idx < EXTS.length - 1) {
      setIdx((i) => i + 1)
    } else {
      setFailed(true)
    }
  }

  const displaySrc = failed ? FALLBACK_IMG : resolved
  const canZoom = zoomable && openLightbox

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      className={`${className}${canZoom ? ' cursor-pointer' : ''}`}
      onError={failed ? undefined : handleError}
      onClick={canZoom ? () => openLightbox(displaySrc, alt) : undefined}
      {...rest}
    />
  )
}

// ---------------------------------------------------------------------------
// Lightbox — phóng ảnh ra giữa màn hình, nền tối nhẹ, X / click ngoài để tắt
// ---------------------------------------------------------------------------
function Lightbox({ data, onClose }) {
  useEffect(() => {
    if (!data) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [data, onClose])

  if (!data) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-[fadeIn_0.2s_ease]"
    >
      <button
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-5 right-5 grid place-items-center h-11 w-11 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <img
        src={data.src}
        alt={data.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionTitle — IN HOA, gạch chân gold ở giữa
// ---------------------------------------------------------------------------
function SectionTitle({ children, light = false }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2
        className={`font-serif text-balance whitespace-pre-line leading-[1.35] text-2xl md:text-4xl font-bold uppercase tracking-tight ${
          light ? 'text-white' : 'text-brand'
        }`}
      >
        {children}
      </h2>
      <span className="mt-4 inline-block h-1 w-16 rounded-full bg-gold" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header — fixed, ẩn khi cuộn xuống / hiện khi cuộn lên
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { label: 'Tổng quan', href: '#tong-quan' },
  { label: 'Vị trí', href: '#vi-tri' },
  { label: 'Tiện ích', href: '#tien-ich' },
  { label: 'Mặt bằng', href: '#mat-bang' },
  { label: 'Giá bán', href: '#gia-ban' },
  { label: 'Liên hệ', href: '#lead-form-1' },
]

function Header({ project }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pill, setPill] = useState(null) // { left, width } của option đang hover
  const lastY = useRef(0)

  const moveTo = (el, idx) =>
    setPill({ left: el.offsetLeft, width: el.offsetWidth, idx })

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY.current && y > 120)
      setScrolled(y > 80)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        backgroundColor: scrolled ? '#ffffff' : 'transparent',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-center md:justify-between">
        <Img
          src={project.logo || '/images/logo.png'}
          alt={project.name}
          zoomable={false}
          className={`hidden md:block h-12 w-auto max-w-[170px] object-contain transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
        <nav
          onMouseLeave={() => setPill(null)}
          className="relative flex items-center gap-4 md:gap-7 overflow-x-auto py-2 px-3 md:px-6"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              height: '2.5rem',
              left: pill?.left ?? 0,
              width: pill?.width ?? 0,
              opacity: pill ? 1 : 0,
              backgroundColor: 'var(--color-gold)',
              transition:
                'left 480ms cubic-bezier(0.34,1.56,0.64,1), width 480ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease',
            }}
          />
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onMouseEnter={(e) => moveTo(e.currentTarget, i)}
              className="relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-sm md:text-base font-semibold transition-colors"
              style={{ color: pill?.idx === i ? '#ffffff' : 'var(--color-brand)' }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Hero — ảnh nền dạng <img> absolute + gradient tối
// ---------------------------------------------------------------------------
function Hero({ project, onCta }) {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-20 overflow-hidden">
      <Img
        src={project.heroImage}
        alt={project.name}
        zoomable={false}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 w-full -translate-y-20">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight [text-shadow:0_2px_6px_rgba(0,0,0,0.55),0_0_18px_rgba(0,0,0,0.4)]">
            {project.name}
          </h1>
          <p
            className="mt-5 text-lg md:text-2xl font-semibold leading-snug [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,0.7)]"
            style={{ color: '#f4b826' }}
          >
            {project.shortDescription}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(project.badges || []).map((b, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 text-white"
              >
                <div className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: '#ffc63c' }}>
                  {b.label}
                </div>
                <div className="mt-1 text-sm md:text-base font-bold leading-tight">
                  {b.value}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onCta}
            className="mt-9 rounded-full bg-gold px-8 py-3.5 text-base md:text-lg font-bold text-white hover:bg-gold-dark transition-colors shadow-lg shadow-black/30"
          >
            Nhận bảng giá & giỏ hàng
          </button>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Intro
// ---------------------------------------------------------------------------
function Intro({ project }) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-brand px-6 py-8 md:px-12 md:py-12 text-justify space-y-5 shadow-xl">
          {(project.longDescription || []).map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-white/95">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// ProjectInfo — trái bảng / phải 4 vòng tròn
// ---------------------------------------------------------------------------
function ProjectInfo({ project }) {
  return (
    <section id="tong-quan" className="scroll-mt-20 bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{project.infoTitle}</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 overflow-hidden">
            <dl className="divide-y divide-stone-100">
              {(project.info || []).map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 px-5 py-3.5">
                  <dt className="col-span-1 text-sm font-semibold text-brand">
                    {row.label}
                  </dt>
                  <dd className="col-span-2 text-sm text-stone-700">
                    {row.value.includes('·') ? (
                      <ul className="space-y-1">
                        {row.value.split('·').map((part, j) => (
                          <li key={j}>{part.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-7 justify-items-center">
            {(project.highlights || []).map((h, i) => (
              <div
                key={i}
                className="group aspect-square w-full max-w-[200px] rounded-full bg-brand border-4 border-gold flex flex-col items-center justify-center text-center text-white p-4 transition-all duration-300 hover:scale-105 hover:bg-gold hover:shadow-xl"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-gold transition-colors duration-300 group-hover:text-brand">
                  {h.value}
                </div>
                <div className="mt-1 text-xs md:text-sm font-medium leading-tight transition-colors duration-300 group-hover:text-brand">
                  {h.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Particles — vài hạt li ti trôi nhẹ trong nền
// ---------------------------------------------------------------------------
function Particles({ count = 130 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let parts = []
    let raf = 0

    const init = () => {
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.7 + Math.random() * 1.8, // size nhỏ ngẫu nhiên, ~ 2.5 hạt
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: 0.12 + Math.random() * 0.33,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
        if (p.y < -12) p.y = h + 12
        if (p.y > h + 12) p.y = -12

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    const ro = new ResizeObserver(init)
    ro.observe(parent)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [count])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden />
}

// ---------------------------------------------------------------------------
// LeadForm — gửi thẳng Apps Script
// ---------------------------------------------------------------------------
function LeadForm({ project, source, id }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const webhook = import.meta.env.VITE_SHEETS_WEBHOOK_URL

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const cleanPhone = phone.replace(/[^\d]/g, '')
    if (!name.trim()) return setError('Vui lòng nhập họ tên.')
    if (cleanPhone.length < 9 || cleanPhone.length > 11)
      return setError('Số điện thoại không hợp lệ.')

    setSending(true)
    try {
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: project.name,
            createdAt: new Date().toLocaleString('vi-VN'),
            name: name.trim(),
            phone: cleanPhone,
            source,
          }),
        })
      } else {
        console.warn('VITE_SHEETS_WEBHOOK_URL chưa cấu hình — bỏ qua gửi.')
      }
      setDone(true)
      // Meta Pixel — đếm chuyển đổi Lead khi gửi form thành công
      if (window.fbq) window.fbq('track', 'Lead')
      // Sau 5s tự quay lại form trống
      setTimeout(() => {
        setDone(false)
        setName('')
        setPhone('')
      }, 5000)
    } catch (err) {
      // no-cors không đọc được response; lỗi mạng thật mới rơi vào đây
      setError('Gửi không thành công, vui lòng gọi hotline ' + project.cta?.hotline)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id={id} className="relative overflow-hidden bg-brand py-16 md:py-20">
      <Particles />
      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <h2 className="font-serif text-2xl md:text-4xl font-bold uppercase leading-tight">
            {project.cta?.title}
          </h2>
          <p className="mt-4 text-stone-200 text-base md:text-lg">
            {project.cta?.subtitle}
          </p>
          <a
            href={`tel:${(project.cta?.hotline || '').replace(/[^\d+]/g, '')}`}
            className="mt-6 inline-flex items-center gap-2 text-gold text-xl md:text-2xl font-extrabold"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z" />
            </svg>
            Hotline: {project.cta?.hotline}
          </a>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl">
          {done ? (
            <div className="text-center py-8">
              <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-brand text-gold">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-brand">Cảm ơn {name}!</h3>
              <p className="mt-2 text-stone-600">
                Bảng giá sẽ được gửi qua Zalo số <strong>{phone}</strong>. Chuyên viên
                sẽ liên hệ với quý khách trong thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h3 className="text-lg font-bold text-brand">
                Đăng ký nhận bảng giá ngay
              </h3>
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-gold py-3.5 font-bold text-white hover:bg-gold-dark transition-colors disabled:opacity-60"
              >
                {sending ? 'Đang gửi…' : 'Nhận bảng giá ngay'}
              </button>
              <p className="text-xs text-stone-500 text-center">{project.cta?.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
function Location({ project }) {
  const loc = project.location || {}
  return (
    <section id="vi-tri" className="scroll-mt-20 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{loc.title}</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-justify">
            {(loc.paragraphs || []).map((p, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
                {p}
              </p>
            ))}
            {loc.connections?.length > 0 && (
              <div className="pt-1">
                {loc.connectionsTitle && (
                  <p className="font-semibold text-brand mb-2">{loc.connectionsTitle}</p>
                )}
                <ul className="space-y-2.5">
                  {loc.connections.map((c, i) => (
                    <li key={i} className="flex gap-3 text-base md:text-lg leading-relaxed text-stone-700">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {loc.image && (
            <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <Img src={loc.image} alt={loc.title} className="w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Differences — 3 thẻ số thứ tự tròn
// ---------------------------------------------------------------------------
function Differences({ project }) {
  const d = project.differences || {}
  return (
    <section className="bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{d.title}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(d.items || []).map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-stone-200"
            >
              <div className="grid place-items-center h-12 w-12 rounded-full bg-brand text-white text-xl font-extrabold">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-bold text-brand uppercase leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-stone-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Amenities — đoạn + lưới ảnh có figcaption
// ---------------------------------------------------------------------------
function Amenities({ project }) {
  const a = project.amenities || {}
  return (
    <section id="tien-ich" className="scroll-mt-20 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{a.title}</SectionTitle>
        <div className="space-y-4 max-w-3xl mx-auto text-justify mb-12">
          {(a.paragraphs || []).map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
              {p}
            </p>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(a.images || []).map((img, i) => (
            <figure key={i} className="group">
              <div className="overflow-hidden rounded-xl ring-1 ring-stone-200 aspect-[4/3]">
                <Img
                  src={img.src}
                  alt={img.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 text-center text-sm font-medium text-stone-600">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// FloorPlan — ảnh trái, chữ phải
// ---------------------------------------------------------------------------
function FloorPlan({ project }) {
  const f = project.floorPlan || {}
  return (
    <section id="mat-bang" className="scroll-mt-20 bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{f.title}</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {f.image && (
            <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <Img src={f.image} alt={f.title} className="w-full object-cover" />
            </div>
          )}
          <div className="space-y-4">
            {(f.paragraphs || []).map((p, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Design — chữ + 2 ảnh
// ---------------------------------------------------------------------------
function Design({ project }) {
  const d = project.design || {}
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{d.title}</SectionTitle>
        <div className="space-y-4 max-w-3xl mx-auto text-justify mb-10">
          {(d.paragraphs || []).map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
              {p}
            </p>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {(d.images || []).map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl ring-1 ring-stone-200 aspect-[4/3]"
            >
              <Img src={src} alt={`${d.title} ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Pricing — thẻ loại căn
// ---------------------------------------------------------------------------
function Pricing({ project, onCta }) {
  const p = project.pricing || {}
  return (
    <section id="gia-ban" className="scroll-mt-20 bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{p.title}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(p.units || []).map((u, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-stone-200 flex flex-col"
            >
              <div className="bg-brand px-6 py-4 text-center">
                <h3 className="text-white font-bold text-lg leading-tight">{u.type}</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-3">
                <Row label="Diện tích" value={u.area} />
                <Row label="Giá bán" value={u.price} highlight />
                <Row label="Thanh toán" value={u.payment} />
                <button
                  onClick={onCta}
                  className="mt-auto rounded-lg bg-gold py-2.5 font-semibold text-white hover:bg-gold-dark transition-colors"
                >
                  Nhận báo giá chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
        {p.note && (
          <p className="mt-8 text-center text-sm text-stone-500 md:whitespace-nowrap">
            {p.note}
          </p>
        )}
      </div>
    </section>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
      <span className="text-sm text-stone-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-gold-dark' : 'text-brand'}`}>
        {value}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reasons — số thứ tự tròn gold
// ---------------------------------------------------------------------------
function Reasons({ project }) {
  const r = project.reasons || {}
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SectionTitle>{r.title}</SectionTitle>
        <div className="space-y-5">
          {(r.items || []).map((item, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-gold text-white font-extrabold">
                {i + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand uppercase">{item.title}</h3>
                <p className="mt-1.5 text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Buyers — 3 thẻ viền trên gold
// ---------------------------------------------------------------------------
function Buyers({ project }) {
  const b = project.buyers || {}
  return (
    <section className="bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{b.title}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(b.items || []).map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-stone-200 border-t-4 border-gold"
            >
              <h3 className="text-lg font-bold text-brand">{item.title}</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// FAQ — accordion grid-rows 0fr→1fr, chevron xoay
// ---------------------------------------------------------------------------
function FAQ({ project }) {
  const f = project.faq || {}
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle>{f.title}</SectionTitle>
        <div className="space-y-3">
          {(f.items || []).map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`rounded-xl ring-1 overflow-hidden transition-colors ${
                  isOpen ? 'ring-gold bg-stone-50' : 'ring-stone-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-brand">{item.question}</span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-gold-dark transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-stone-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Consultant — ảnh trái, thông tin phải
// ---------------------------------------------------------------------------
function Consultant({ project }) {
  const c = project.consultant || {}
  const tel = (c.phone || '').replace(/[^\d+]/g, '')
  return (
    <section className="bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle>{c.title}</SectionTitle>
        <div className="grid md:grid-cols-5 gap-8 md:gap-16 items-center">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200 aspect-[3/4]">
              <Img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-serif text-3xl font-extrabold text-brand">{c.name}</h3>
            <p className="text-gold-dark font-semibold">{c.role}</p>
            <div className="mt-4 space-y-3 text-stone-600 leading-relaxed">
              {(c.description || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a
              href={`tel:${tel}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-bold text-white hover:bg-brand-light transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z" />
              </svg>
              Gọi tư vấn: {c.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer({ project }) {
  const f = project.footer || {}
  return (
    <footer className="bg-white text-stone-600 py-12 border-t border-stone-200">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center">
            <Img
              src={project.logo || '/images/logo.png'}
              alt={project.name}
              zoomable={false}
              className="h-20 w-auto max-w-[260px] object-contain"
            />
          </div>
          {f.company && <p className="mt-4 text-sm font-semibold text-brand">{f.company}</p>}
          {f.address && <p className="text-sm text-stone-500">{f.address}</p>}
        </div>
        <div className="md:text-right space-y-1.5 text-sm">
          <p>
            Hotline:{' '}
            <a href={`tel:${(f.hotline || '').replace(/[^\d+]/g, '')}`} className="text-gold-dark font-bold">
              {f.hotline}
            </a>
          </p>
          <p>
            Email: <a href={`mailto:${f.email}`} className="text-gold-dark">{f.email}</a>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 mt-8 pt-6 border-t border-stone-200 flex flex-col items-center gap-2 text-xs text-stone-400">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a href="/chinh-sach-bao-mat.html" className="hover:text-gold-dark transition-colors">Chính sách bảo mật</a>
          <span className="text-stone-300">·</span>
          <a href="/dieu-khoan.html" className="hover:text-gold-dark transition-colors">Điều khoản sử dụng</a>
        </nav>
        <p>{f.copyright}</p>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// ZaloButton — nút tròn nổi cố định
// ---------------------------------------------------------------------------
function ZaloButton({ project }) {
  if (!project.zalo) return null
  return (
    <a
      href={project.zalo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
      className="fixed bottom-32 md:bottom-5 right-5 z-50 grid place-items-center h-14 w-14 hover:scale-105 transition-transform"
    >
      <span className="zalo-wave-2 absolute inset-0 rounded-full" style={{ backgroundColor: '#0068ff' }} />
      <span className="zalo-wave-1 absolute inset-0 rounded-full" style={{ backgroundColor: '#0068ff' }} />
      <span
        className="relative grid place-items-center h-full w-full rounded-full text-white shadow-lg shadow-black/30"
        style={{ backgroundColor: '#0068ff' }}
      >
        <svg className="h-8 w-8" viewBox="0 0 48 48">
          <path
            fill="#fff"
            d="M24 9C14.6 9 7 15.4 7 23.3c0 4.3 2.3 8.1 5.9 10.7-.2 1.6-.9 3.6-2.4 5.4-.4.5 0 1.2.6 1.1 3-.4 5.6-1.6 7.4-2.7 1.7.4 3.5.6 5.5.6 9.4 0 17-6.4 17-14.3S33.4 9 24 9z"
          />
          <text
            x="24"
            y="27.5"
            fontSize="11.5"
            fontWeight="800"
            fontStyle="italic"
            fill="#0068ff"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            Zalo
          </text>
        </svg>
      </span>
    </a>
  )
}

// ---------------------------------------------------------------------------
// PopupForm — popup tự hiện sau vài giây, gửi lead về Apps Script
// ---------------------------------------------------------------------------
function PopupForm({ project, open, onClose }) {
  const pop = project.popup || {}
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const webhook = import.meta.env.VITE_SHEETS_WEBHOOK_URL

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const cleanPhone = phone.replace(/[^\d]/g, '')
    if (!name.trim()) return setError('Vui lòng nhập họ tên.')
    if (cleanPhone.length < 9 || cleanPhone.length > 11)
      return setError('Số điện thoại không hợp lệ.')
    setSending(true)
    try {
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: project.name,
            createdAt: new Date().toLocaleString('vi-VN'),
            name: name.trim(),
            phone: cleanPhone,
            source: 'Popup - Tự hiện',
          }),
        })
      }
      setDone(true)
      // Meta Pixel — đếm chuyển đổi Lead khi gửi form thành công
      if (window.fbq) window.fbq('track', 'Lead')
      setTimeout(() => onClose(), 4000)
    } catch (err) {
      setError('Gửi không thành công, vui lòng gọi hotline ' + project.cta?.hotline)
    } finally {
      setSending(false)
    }
  }

  if (!open) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 animate-[fadeIn_0.2s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-brand p-6 md:p-10 border-2 border-dashed border-white/50 shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 grid place-items-center h-9 w-9 rounded-full text-gold hover:bg-white/10 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="text-center text-white font-serif font-bold uppercase leading-tight">
          {(pop.title || []).map((line, i) => (
            <div key={i} className={i === 0 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}>
              {line}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(pop.cards || []).map((c, i) => (
            <div key={i} className="rounded-2xl bg-gold text-brand text-center p-4 flex flex-col justify-center">
              <div className="text-[11px] font-bold uppercase leading-tight">{c.label}</div>
              <div className="my-1 text-2xl font-extrabold leading-none">{c.value}</div>
              <div className="text-[11px] font-medium leading-tight">{c.sub}</div>
            </div>
          ))}
        </div>

        {done ? (
          <div className="mt-8 text-center text-white py-4">
            <h3 className="font-serif text-2xl font-bold">Cảm ơn {name}!</h3>
            <p className="mt-2 text-white/90">
              Bảng giá & chính sách sẽ được gửi qua Zalo số <strong>{phone}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 max-w-md mx-auto space-y-3">
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-gold"
            />
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-gold"
            />
            {error && <p className="text-sm text-amber-200">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-gold py-3.5 font-bold text-white uppercase hover:bg-gold-dark transition-colors disabled:opacity-60"
            >
              {sending ? 'Đang gửi…' : pop.button || 'Nhận ngay'}
            </button>
            <p className="text-center text-xs text-white/70">{project.cta?.note}</p>
          </form>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FloatingCTAs — 2 nút nổi: tư vấn Zalo + tải bảng giá (mở popup)
// ---------------------------------------------------------------------------
function FloatingCTAs({ project, onOpenPopup }) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        aria-label="Mở rộng"
        className="fixed bottom-4 left-4 z-40 grid place-items-center h-10 w-12 rounded-full bg-black/30 text-white backdrop-blur-md ring-1 ring-white/30 shadow-lg hover:bg-black/40 transition"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-sm">
      <div className="relative rounded-3xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 shadow-xl p-3 pt-5 flex flex-col gap-2">
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Thu gọn"
          className="absolute -top-3 left-1/2 -translate-x-1/2 grid place-items-center h-7 w-12 rounded-full bg-black/35 text-white backdrop-blur-md ring-1 ring-white/30 hover:bg-black/50 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <a
          href={project.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-full py-3 px-5 font-bold text-white shadow-lg shadow-black/30 hover:brightness-110 transition"
          style={{ backgroundColor: '#0068ff' }}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3C6.99 3 3 6.36 3 10.5c0 2.3 1.23 4.35 3.17 5.74-.13.86-.5 1.96-1.3 2.96-.2.25-.02.62.3.58 1.66-.22 3.07-.86 4.04-1.46.86.2 1.76.31 2.69.31 5.01 0 9-3.36 9-7.5S17.01 3 12 3z" />
          </svg>
          TƯ VẤN QUA ZALO
        </a>
        <button
          onClick={onOpenPopup}
          className="w-full flex items-center justify-center gap-2 rounded-full py-3 px-5 font-bold text-white shadow-lg shadow-black/30 hover:brightness-110 transition"
          style={{ backgroundColor: '#e11d2a' }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
          NHẬN BẢNG GIÁ 10 CĂN TỐT NHẤT
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LandingPage — bố cục tổng + áp theme bằng biến CSS
// ---------------------------------------------------------------------------
export default function LandingPage({ project }) {
  const t = project.theme || {}
  const [zoom, setZoom] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const openLightbox = (src, alt) => setZoom({ src, alt })
  const scrollToForm = () => {
    document.getElementById('lead-form-1')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Popup chỉ mở khi người dùng chủ động bấm nút (không tự bật để tránh "intrusive interstitial")

  return (
    <LightboxContext.Provider value={openLightbox}>
    <div
      style={{
        '--color-brand': t.brand || '#0f3d2e',
        '--color-brand-light': t.brandLight || '#1b5e44',
        '--color-gold': t.gold || '#c9a86a',
        '--color-gold-dark': t.goldDark || '#a9883f',
      }}
    >
      <Header project={project} />
      <Hero project={project} onCta={scrollToForm} />
      <Intro project={project} />
      <ProjectInfo project={project} />
      <LeadForm project={project} source="Form 1 - Sau thông tin dự án" id="lead-form-1" />
      <Location project={project} />
      <Differences project={project} />
      <Amenities project={project} />
      <FloorPlan project={project} />
      <Design project={project} />
      <Pricing project={project} onCta={scrollToForm} />
      <LeadForm project={project} source="Form 2 - Sau bảng giá" id="lead-form-2" />
      <Reasons project={project} />
      <Buyers project={project} />
      <FAQ project={project} />
      <Consultant project={project} />
      <LeadForm project={project} source="Form 3 - Sau tư vấn viên" id="lead-form-3" />
      <Footer project={project} />
      <ZaloButton project={project} />
      <FloatingCTAs project={project} onOpenPopup={() => setPopupOpen(true)} />
      <PopupForm project={project} open={popupOpen} onClose={() => setPopupOpen(false)} />
      <Lightbox data={zoom} onClose={() => setZoom(null)} />
    </div>
    </LightboxContext.Provider>
  )
}
