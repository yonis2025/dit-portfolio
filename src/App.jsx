
import { useState } from 'react'
import './App.css'

const API_URL = 'https://yonis-portfolio-api.onrender.com'

const pages = [
  'Home',
  'About Me',
  'Projects',
  'Education',
  'Services',
  'Contact Me',
]

const projects = [
  {
    number: '01',
    name: 'BioShield X',
    category: 'Health technology · Research concept',
    description:
      'A proposed wearable health intelligence platform exploring biosensors, personalized monitoring and early health alerts.',
    role: 'Founder and concept developer',
    outcome: 'Research concept and proposed product direction.',
    art: 'health',
    symbol: '♡',
  },
  {
    number: '02',
    name: 'AEGIS DOME',
    category: 'Personal safety · Concept',
    description:
      'An exploratory digital safety platform combining intelligent navigation, location awareness and personal security features.',
    role: 'Concept designer',
    outcome: 'Initial platform concept and feature planning.',
    art: 'safety',
    symbol: '◇',
  },
  {
    number: '03',
    name: 'DIT Portfolio',
    category: 'React · Web development',
    description:
      'A responsive portfolio website introducing DIT, showcasing projects and providing a way for visitors to get in touch.',
    role: 'Web developer and designer',
    outcome: 'An interactive React website built for my portfolio.',
    art: 'web',
    symbol: '</>',
  },
]

function Watch({ small = false }) {
  return (
    <div
      className={`watch-scene ${small ? 'watch-small' : ''}`}
      aria-label="Illustration of a proposed BioShield X wearable"
    >
      <div className="watch-glow" />
      <div className="watch-strap watch-strap-top" />
      <div className="watch-strap watch-strap-bottom" />

      <div className="watch-case">
        <div className="watch-screen">
          <div className="watch-topline">
            <span>BioShield X</span>
            <span>● LIVE</span>
          </div>

          <div className="watch-heart">♡</div>

          <div className="watch-reading">
            72 <small>BPM</small>
          </div>

          <svg
            className="watch-wave"
            viewBox="0 0 250 55"
            aria-hidden="true"
          >
            <polyline
              points="0,29 37,29 49,19 60,40 78,4 94,49 108,29 145,29 158,19 171,36 187,29 250,29"
              fill="none"
              stroke="#77f2c0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="watch-bottomline">
            <span>HEART RATE</span>
            <span>CONCEPT DEVICE</span>
          </div>
        </div>

        <div className="watch-crown" />
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [contactError, setContactError] = useState('')

  function navigate(nextPage) {
    setPage(nextPage)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleContact(event) {
    event.preventDefault()

    if (sending) return

    const form = event.currentTarget
    const formData = new FormData(form)

    const contact = {
      firstname: String(formData.get('firstName') || '').trim(),
      lastname: String(formData.get('lastName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
    }

    setSending(true)
    setContactError('')

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      })

      if (!response.ok) {
        throw new Error('Contact submission failed')
      }

      form.reset()
      setSent(true)
      navigate('Home')
    } catch (error) {
      console.error('Contact submission error:', error)
      setContactError(
        'Unable to submit your contact information. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="site">
      <header className="header">
        <button
          className="brand"
          onClick={() => navigate('Home')}
          aria-label="DIT Home"
        >
          <span className="brand-mark">
            <span className="brand-d">D</span>
            <span className="brand-it">IT</span>
            <span className="brand-dot" />
          </span>

          <span className="brand-text">
            <strong>DUALE</strong>
            <small>INSTITUTE OF TECHNOLOGY</small>
          </span>
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          className={`nav ${menuOpen ? 'nav-open' : ''}`}
          aria-label="Main navigation"
        >
          {pages.map((item) => (
            <button
              key={item}
              className={page === item ? 'nav-active' : ''}
              onClick={() => navigate(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {page === 'Home' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  THE FUTURE STARTS HERE
                </span>

                <h1>
                  Technology that
                  <br />
                  <span className="gradient-text">empowers.</span>
                  <br />
                  Innovation that
                  <br />
                  <span className="gradient-text">matters.</span>
                </h1>

                <p>
                  Building a future where intelligent software,
                  health innovation and accessible education
                  create meaningful change.
                </p>

                <div className="button-row">
                  <button
                    className="button button-dark"
                    onClick={() => navigate('Projects')}
                  >
                    Explore our work <span>↗</span>
                  </button>

                  <button
                    className="button button-light"
                    onClick={() => navigate('About Me')}
                  >
                    Our story <span>→</span>
                  </button>
                </div>

                <div className="hero-caption">
                  <span className="caption-dot" />
                  An emerging technology initiative by Yonis Galayr
                </div>
              </div>

              <div className="hero-art">
                <span className="art-label art-label-top">
                  HUMAN-CENTRED INNOVATION
                </span>

                <Watch />

                <span className="art-label art-label-bottom">
                  IMAGINE WHAT'S POSSIBLE ↗
                </span>
              </div>
            </section>

            <section className="value-strip">
              <div>
                <span>01 /</span>
                <strong>Software</strong>
                <small>Thoughtfully engineered</small>
              </div>

              <div>
                <span>02 /</span>
                <strong>Health</strong>
                <small>Human-centred innovation</small>
              </div>

              <div>
                <span>03 /</span>
                <strong>Education</strong>
                <small>Knowledge without limits</small>
              </div>

              <div>
                <span>04 /</span>
                <strong>Impact</strong>
                <small>Ideas that move us forward</small>
              </div>
            </section>

            <section className="statement-section">
              <span className="eyebrow">OUR MISSION</span>

              <h2>
                Great technology begins with{' '}
                <em>a better question.</em>
              </h2>

              <p>
                At Duale Institute of Technology, our vision is
                to explore how software, research and education
                can make everyday life better. We believe
                innovation should be useful, accessible and
                designed around people.
              </p>

              <button
                className="text-link"
                onClick={() => navigate('About Me')}
              >
                Discover our vision <span>↗</span>
              </button>
            </section>

            <section className="showcase">
              <div className="showcase-copy">
                <span className="eyebrow">
                  INTRODUCING A RESEARCH CONCEPT
                </span>

                <h2>
                  BioShield <span>X.</span>
                </h2>

                <h3>
                  A more connected vision for personal health.
                </h3>

                <p>
                  An exploratory wearable concept investigating
                  how biosensors, intelligent software and
                  personalized insights might support health
                  monitoring. BioShield X is a proposed product,
                  not a clinically validated medical device.
                </p>

                <button
                  className="button button-dark"
                  onClick={() => navigate('Projects')}
                >
                  Explore the concept <span>↗</span>
                </button>
              </div>

              <div className="showcase-art">
                <Watch small />
              </div>
            </section>

            <section className="closing-section">
              <span className="eyebrow">
                LET'S CREATE SOMETHING MEANINGFUL
              </span>

              <h2>
                The next great idea starts with a conversation.
              </h2>

              <button
                className="button button-dark"
                onClick={() => navigate('Contact Me')}
              >
                Get in touch <span>↗</span>
              </button>
            </section>
          </>
        )}

        {page === 'About Me' && (
          <section className="inner-page">
            <span className="eyebrow">
              THE PERSON BEHIND THE VISION
            </span>

            <h1>Building with purpose.</h1>

            <div className="about-grid">
              <div className="portrait-placeholder">
                <img
                  src="/profile.png"
                  alt="Profile portrait"
                  className="profile-photo"
                />
              </div>

              <div className="about-copy">
                <h2>Hi, I'm Yonis Galayr.</h2>

                <p>
                  I'm a Software Engineering Technology student
                  at Centennial College with an interest in web
                  development, software systems and emerging
                  technologies.
                </p>

                <p>
                  Duale Institute of Technology is my vision for
                  an emerging technology initiative that brings
                  together practical software development,
                  education and ambitious research ideas.
                </p>

                <p>
                  Through projects such as BioShield X, I'm
                  exploring how technology might address
                  real-world challenges while continuing to
                  develop my technical skills.
                </p>

                <a
                  className="button button-dark"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  View my résumé <span>↗</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {page === 'Projects' && (
          <section className="inner-page">
            <span className="eyebrow">
              SELECTED WORK & EXPLORATIONS
            </span>

            <h1>Ideas in motion.</h1>

            <p className="page-lead">
              A collection of software work and early-stage
              technology concepts. Each project is labelled
              according to its current stage.
            </p>

            <div className="project-grid">
              {projects.map((project) => (
                <article
                  className="project-card"
                  key={project.number}
                >
                  <div
                    className={`project-image ${project.art}`}
                  >
                    <span className="project-art-symbol">
                      {project.symbol}
                    </span>

                    <span className="project-art-number">
                      {project.number} / DIT
                    </span>
                  </div>

                  <div className="project-info">
                    <span className="eyebrow">
                      {project.category}
                    </span>

                    <h2>{project.name}</h2>

                    <p>{project.description}</p>

                    <p>
                      <strong>My role:</strong>{' '}
                      {project.role}
                    </p>

                    <p>
                      <strong>Current outcome:</strong>{' '}
                      {project.outcome}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'Education' && (
          <section className="inner-page">
            <span className="eyebrow">
              ACADEMIC JOURNEY
            </span>

            <h1>Learning. Building. Evolving.</h1>

            <p className="page-lead">
              My education provides the foundation for the
              software and technology projects I'm developing.
            </p>

            <div className="education-card">
              <span className="education-year">
                2026 — PRESENT
              </span>

              <div>
                <h2>
                  Software Engineering Technology
                </h2>

                <h3>
                  Centennial College · Optional Co-op
                </h3>

                <p>
                  Currently studying software development,
                  Java programming, web application
                  development, databases, systems analysis
                  and software design.
                </p>

                <span className="status-pill">
                  In progress
                </span>
              </div>
            </div>

            <div className="education-banner">
              <span className="eyebrow">
                CONTINUOUS LEARNING
              </span>

              <h2>
                Curiosity is a lifelong advantage.
              </h2>

              <p>
                I continue to strengthen my programming,
                problem-solving and product-design skills
                through coursework and projects.
              </p>
            </div>
          </section>
        )}

        {page === 'Services' && (
          <section className="inner-page">
            <span className="eyebrow">
              WHAT I WORK ON
            </span>

            <h1>Technology with intention.</h1>

            <p className="page-lead">
              My current areas of study and developing
              technical capability.
            </p>

            <div className="services-grid">
              <article className="service-card">
                <div className="service-art service-code">
                  ⌘
                </div>

                <span>01 / DEVELOPMENT</span>

                <h2>Web development</h2>

                <p>
                  Building responsive websites and
                  interactive interfaces using modern
                  web technologies.
                </p>
              </article>

              <article className="service-card">
                <div className="service-art service-software">
                  ◈
                </div>

                <span>02 / SOFTWARE</span>

                <h2>Software engineering</h2>

                <p>
                  Applying programming, software design
                  and problem-solving skills to practical
                  projects.
                </p>
              </article>

              <article className="service-card">
                <div className="service-art service-ideas">
                  ✳
                </div>

                <span>03 / INNOVATION</span>

                <h2>Technology concepts</h2>

                <p>
                  Exploring early-stage ideas in digital
                  health, personal safety and technology
                  education.
                </p>
              </article>
            </div>
          </section>
        )}

        {page === 'Contact Me' && (
          <section className="inner-page">
            <span className="eyebrow">
              START A CONVERSATION
            </span>

            <h1>Let's connect.</h1>

            <div className="contact-grid">
              <div className="contact-details">
                <h2>
                  Have an idea or a question?
                </h2>

                <p>
                  I'd be glad to hear from you. Reach out
                  using the details below or the contact form.
                </p>

                <div className="contact-detail">
                  <span>EMAIL</span>

                  <a href="mailto:yonisgalayr@gmail.com">
                    yonisgalayr@gmail.com
                  </a>
                </div>

                <div className="contact-detail">
                  <span>PHONE</span>

                  <a href="tel:18003453455">
                    1800-345-3455
                  </a>
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={handleContact}
              >
                <div className="form-row">
                  <label>
                    First name

                    <input
                      name="firstName"
                      required
                      maxLength={100}
                      placeholder="First name"
                    />
                  </label>

                  <label>
                    Last name

                    <input
                      name="lastName"
                      required
                      maxLength={100}
                      placeholder="Last name"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Phone

                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone number"
                    />
                  </label>

                  <label>
                    Email

                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      placeholder="Email address"
                    />
                  </label>
                </div>

                <label>
                  Message

                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Tell me about your idea..."
                  />
                </label>

                <button
                  className="button button-dark"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? 'Submitting...' : 'Submit contact'}
                  <span>↗</span>
                </button>

                {contactError && (
                  <p role="alert" className="small-note">
                    {contactError}
                  </p>
                )}

                <p className="small-note">
                  This form currently submits your name and
                  email address to our database. Phone numbers
                  and message text are not saved yet.
                </p>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <strong className="footer-brand">
              DIT<span>.</span>
            </strong>

            <p>
              Duale Institute of Technology
            </p>

            <small>
              Innovate. Educate. Empower.
            </small>
          </div>

          <button
            className="footer-contact"
            onClick={() => navigate('Contact Me')}
          >
            Let's talk <span>↗</span>
          </button>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            Duale Institute of Technology
          </span>

          <span>
            Designed and developed by Yonis Galayr
          </span>
        </div>
      </footer>

      {sent && page === 'Home' && (
        <div className="form-notice" role="status">
          Contact information submitted successfully. Thank you!

          <button
            onClick={() => setSent(false)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default App
