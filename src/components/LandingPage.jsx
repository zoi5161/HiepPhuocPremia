import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Img — thử lần lượt các đuôi file nếu đường dẫn không có đuôi, fallback placehold.
// Cho phép dán URL ngoài trực tiếp (http...).
// ---------------------------------------------------------------------------
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']

function Img({ src, alt = '', className = '', ...rest }) {
  const isExternal = /^https?:\/\//i.test(src || '')
  const hasExt = /\.[a-z0-9]+$/i.test(src || '')
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  let resolved
  if (!src) resolved = `https://placehold.co/800x600?text=Image`
  else if (isExternal || hasExt) resolved = src
  else resolved = `${src}${EXTS[idx]}`

  const handleError = () => {
    if (!isExternal && !hasExt && idx < EXTS.length - 1) {
      setIdx((i) => i + 1)
    } else {
      setFailed(true)
    }
  }

  return (
    <img
      src={failed ? 'https://placehold.co/800x600?text=H%E1%BB%A3p+Ph%C6%B0%E1%BB%9Bc+Premia' : resolved}
      alt={alt}
      loading="lazy"
      className={className}
      onError={failed ? undefined : handleError}
      {...rest}
    />
  )
}

// ---------------------------------------------------------------------------
// SectionTitle — IN HOA, gạch chân gold ở giữa
// ---------------------------------------------------------------------------
function SectionTitle({ children, light = false }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2
        className={`text-2xl md:text-4xl font-bold uppercase tracking-tight ${
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
function Header({ project, onCta }) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY.current && y > 120)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-transform duration-300"
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        backgroundColor: project.theme?.nav || 'var(--color-brand)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white font-bold tracking-wide">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-gold text-brand font-extrabold">
            P
          </span>
          <span className="text-base md:text-lg">{project.name}</span>
        </div>
        <button
          onClick={onCta}
          className="rounded-full bg-gold px-4 md:px-6 py-2 text-sm md:text-base font-semibold text-brand hover:bg-gold-dark hover:text-white transition-colors"
        >
          Nhận bảng giá
        </button>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Hero — ảnh nền dạng <img> absolute + gradient tối
// ---------------------------------------------------------------------------
function Hero({ project, onCta }) {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-16 overflow-hidden">
      <Img
        src={project.heroImage}
        alt={project.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 w-full">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {project.name}
          </h1>
          <p className="mt-5 text-lg md:text-2xl font-semibold text-gold leading-snug">
            {project.shortDescription}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(project.badges || []).map((b, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 text-white"
              >
                <div className="text-[11px] uppercase tracking-wide text-gold font-semibold">
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
            className="mt-9 rounded-full bg-gold px-8 py-3.5 text-base md:text-lg font-bold text-brand hover:bg-gold-dark hover:text-white transition-colors shadow-lg shadow-black/30"
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
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center space-y-5">
        {(project.longDescription || []).map((p, i) => (
          <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// ProjectInfo — trái bảng / phải 4 vòng tròn
// ---------------------------------------------------------------------------
function ProjectInfo({ project }) {
  return (
    <section className="bg-stone-50 py-16 md:py-20">
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
                  <dd className="col-span-2 text-sm text-stone-700">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-7 justify-items-center">
            {(project.highlights || []).map((h, i) => (
              <div
                key={i}
                className="aspect-square w-full max-w-[200px] rounded-full bg-brand border-4 border-gold flex flex-col items-center justify-center text-center text-white p-4"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-gold">
                  {h.value}
                </div>
                <div className="mt-1 text-xs md:text-sm font-medium leading-tight">
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
    } catch (err) {
      // no-cors không đọc được response; lỗi mạng thật mới rơi vào đây
      setError('Gửi không thành công, vui lòng gọi hotline ' + project.cta?.hotline)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id={id} className="bg-brand py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <h2 className="text-2xl md:text-4xl font-bold uppercase leading-tight">
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
                className="w-full rounded-lg bg-gold py-3.5 font-bold text-brand hover:bg-gold-dark hover:text-white transition-colors disabled:opacity-60"
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
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SectionTitle>{loc.title}</SectionTitle>
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          {(loc.paragraphs || []).map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
              {p}
            </p>
          ))}
        </div>
        {loc.image && (
          <div className="mt-10 max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200">
            <Img src={loc.image} alt={loc.title} className="w-full object-cover" />
          </div>
        )}
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
              <div className="grid place-items-center h-12 w-12 rounded-full bg-brand text-gold text-xl font-extrabold">
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
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{a.title}</SectionTitle>
        <div className="space-y-4 max-w-3xl mx-auto text-center mb-12">
          {(a.paragraphs || []).map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-stone-700">
              {p}
            </p>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(a.images || []).map((img, i) => (
            <figure key={i} className="group">
              <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-stone-200 aspect-[4/3]">
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
    <section className="bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{f.title}</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {f.image && (
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200">
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
        <div className="space-y-4 max-w-3xl mx-auto text-center mb-10">
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
              className="overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200 aspect-[4/3]"
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
    <section className="bg-stone-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle>{p.title}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(p.units || []).map((u, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-stone-200 flex flex-col"
            >
              <div className="bg-brand px-6 py-4 text-center">
                <h3 className="text-gold font-bold text-lg leading-tight">{u.type}</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-3">
                <Row label="Diện tích" value={u.area} />
                <Row label="Giá bán" value={u.price} highlight />
                <Row label="Thanh toán" value={u.payment} />
                <button
                  onClick={onCta}
                  className="mt-auto rounded-lg bg-gold py-2.5 font-semibold text-brand hover:bg-gold-dark hover:text-white transition-colors"
                >
                  Nhận báo giá chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
        {p.note && (
          <p className="mt-8 text-center text-sm text-stone-500 max-w-2xl mx-auto">
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
              <div className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-gold text-brand font-extrabold">
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
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200 aspect-[3/4]">
              <Img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-2xl font-extrabold text-brand">{c.name}</h3>
            <p className="text-gold-dark font-semibold">{c.role}</p>
            <div className="mt-4 space-y-3 text-stone-600 leading-relaxed">
              {(c.description || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a
              href={`tel:${tel}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-bold text-gold hover:bg-brand-light transition-colors"
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
    <footer className="bg-brand text-stone-200 py-12">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 text-white font-bold text-lg">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-gold text-brand font-extrabold">
              P
            </span>
            {project.name}
          </div>
          <p className="mt-4 text-sm leading-relaxed">{f.company}</p>
          <p className="text-sm">{f.address}</p>
        </div>
        <div className="md:text-right space-y-1.5 text-sm">
          <p>
            Hotline:{' '}
            <a href={`tel:${(f.hotline || '').replace(/[^\d+]/g, '')}`} className="text-gold font-bold">
              {f.hotline}
            </a>
          </p>
          <p>
            Email: <a href={`mailto:${f.email}`} className="text-gold">{f.email}</a>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 mt-8 pt-6 border-t border-white/15 text-center text-xs text-stone-400">
        {f.copyright}
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
      className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full text-white font-bold shadow-lg shadow-black/30 hover:scale-105 transition-transform"
      style={{ backgroundColor: '#0068ff' }}
    >
      <span className="text-xs leading-none font-extrabold">Zalo</span>
      <span className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style={{ backgroundColor: '#0068ff' }} />
    </a>
  )
}

// ---------------------------------------------------------------------------
// LandingPage — bố cục tổng + áp theme bằng biến CSS
// ---------------------------------------------------------------------------
export default function LandingPage({ project }) {
  const t = project.theme || {}
  const scrollToForm = () => {
    document.getElementById('lead-form-1')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      style={{
        '--color-brand': t.brand || '#0f3d2e',
        '--color-brand-light': t.brandLight || '#1b5e44',
        '--color-gold': t.gold || '#c9a86a',
        '--color-gold-dark': t.goldDark || '#a9883f',
      }}
    >
      <Header project={project} onCta={scrollToForm} />
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
    </div>
  )
}
