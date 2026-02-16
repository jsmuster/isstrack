import { useState } from 'react';
import './App.css';

const testimonials = [
  { id: 1, initials: 'SJ', name: 'Sarah Johnson', role: 'Agency Owner', quote: 'We onboarded our entire team in less than a day. No training sessions, no confusion. Just clean tasks and a board view that everyone instantly understood.' },
  { id: 2, initials: 'MC', name: 'Michael Chen', role: 'Ops Lead', quote: "Finally, a tool without the clutter. List view for planning, Kanban for execution. Clear assignments and priorities. That's literally all we needed." },
  { id: 3, initials: 'ER', name: 'Emily Rodriguez', role: 'Product Manager', quote: 'We switched from a bloated PM tool to PlanClock and never looked back. Comments keep context where it belongs, and the interface just stays out of our way.' },
  { id: 4, initials: 'DK', name: 'David Kim', role: 'Startup Founder', quote: 'The simplicity is the feature. No endless settings, no feature creep. Just tasks, assignments, and a board. Perfect for our small startup team.' },
  { id: 5, initials: 'LT', name: 'Lisa Thompson', role: 'Freelance Designer', quote: "I've tried them all. PlanClock is the only one that doesn't make project management feel like a project itself. Fast, focused, and friction-free." },
  { id: 6, initials: 'JM', name: 'James Martinez', role: 'Team Lead', quote: "Our team loves how quick it is to create tasks and move them across the board. No learning curve, no resistance. Everyone's on board from day one." },
];

const faqItems = [
  { id: 1, question: 'Is PlanClock really that simple?', answer: "Yes. PlanClock includes task creation, assignments, priorities, due dates, comments, list view, and Kanban board. That's the core workflow most teams actually use every day." },
  { id: 2, question: 'Can I switch between List and Kanban?', answer: 'Absolutely. Switch views instantly with one click. The same tasks appear in both views—no setup, no syncing, no confusion.' },
  { id: 3, question: 'Can I assign tasks to teammates?', answer: 'Yes. Invite your team via email, assign tasks to specific people, and everyone sees their assignments clearly. Full visibility, zero ambiguity.' },
  { id: 4, question: 'Do you support priorities and due dates?', answer: 'Yes. Set priorities (high, medium, low) and due dates on any task. Sort and filter by priority to keep your team focused on what matters most.' },
  { id: 5, question: 'Is there a free plan?', answer: 'Yes. PlanClock is free to start with no credit card required. Upgrade to a paid plan when your team grows or you need additional features.' },
];

function App() {
  const [expandedFaqItems, setExpandedFaqItems] = useState<Record<number, boolean>>({});

  const toggleFaqItem = (itemId: number) => {
    setExpandedFaqItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const navigateToApp = () => {
    window.location.href = 'https://app.planclock.com';
  };

  return (
    <div className="planclockcom-website-landing">
      <main className="body">
        {/* HERO SECTION */}
        <section className="hero-section">
          {/* Sticky Header */}
          <header className="header" role="banner">
            <div className="header-container">
              <div className="header-content">
                {/* Logo */}
                <div className="logo-section">
                  <div className="logo-wrapper">
                    <img className="logo-icon" alt="PlanClock logo" src="/div.svg" />
                    <h1 className="logo-text">PlanClock.com</h1>
                  </div>
                </div>
                {/* Navigation */}
                <nav className="nav-section" role="navigation">
                  <button className="nav-sign-in" onClick={navigateToApp} aria-label="Sign in to PlanClock">
                    <span>Sign in</span>
                  </button>
                  <button className="nav-cta-button" onClick={navigateToApp} aria-label="Get started with PlanClock">
                    <span>Get started free</span>
                  </button>
                </nav>
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-main">
              {/* Hero Text */}
              <section className="hero-text-section">
                <div className="hero-text-wrapper">
                  <div className="tag">PLAN CLOCK</div>
                  <div className="hero-content-group">
                    <div className="hero-headline">
                      <h2 className="headline">Simple project management for teams that just want to get work done</h2>
                    </div>
                    <div className="hero-description">
                      <p className="description">
                        Create tasks, assign teammates, set priorities, and move work forward. Track everything in a clean list or visual Kanban board. Keep context in comments, right where decisions happen.
                      </p>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <button className="cta-button primary" onClick={navigateToApp} aria-label="Get started with PlanClock free">
                      Get started free
                    </button>
                    <button className="cta-button secondary" onClick={navigateToApp} aria-label="Watch demo video">
                      See it in action
                    </button>
                  </div>
                  <p className="hero-footer">Free to start. No credit card needed.</p>
                </div>
              </section>

              {/* Hero Image/Features */}
              <section className="hero-image-section">
                <div className="hero-image-container">
                  <img className="hero-image" alt="PlanClock task management interface" src="/img@2x.png" />
                  <div className="hero-features">
                    <button className="feature-button" disabled aria-label="Assign tasks feature">
                      <img className="feature-icon" alt="Assign icon" src="/i.svg" />
                      <span className="feature-label">Assign</span>
                    </button>
                    <div className="feature-item">
                      <img className="feature-icon" alt="Priority icon" src="/i1.svg" />
                      <span className="feature-label">Priority</span>
                    </div>
                  </div>
                  <div className="hero-features-secondary">
                    <div className="feature-item">
                      <img className="feature-icon" alt="Comments icon" src="/i2.svg" />
                      <span className="feature-label">Comments</span>
                    </div>
                    <button className="feature-button" disabled aria-label="Kanban board feature">
                      <img className="feature-icon" alt="Kanban icon" src="/i3.svg" />
                      <span className="feature-label">Kanban</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Trusted By Section */}
            <section className="trusted-section">
              <div className="trusted-headline">
                <p className="trusted-text">Trusted by teams who value focus</p>
              </div>
              <div className="trusted-badges">
                <button className="trusted-badge" disabled aria-label="Agencies use PlanClock">
                  <span>Agencies</span>
                </button>
                <button className="trusted-badge" disabled aria-label="Startups use PlanClock">
                  <span>Startups</span>
                </button>
                <button className="trusted-badge" disabled aria-label="Small teams use PlanClock">
                  <span>Small teams</span>
                </button>
                <button className="trusted-badge" disabled aria-label="Freelancers use PlanClock">
                  <span>Freelancers</span>
                </button>
              </div>
            </section>
          </div>
        </section>

        {/* APPROACH SECTION */}
        <section className="approach-section">
          <div className="section-container">
            <section className="section-header">
              <div className="section-tag">THE PLANCLOCK WAY</div>
              <h2 className="section-title">Project management got complicated, we made it simple</h2>
              <p className="section-subtitle">No endless configuration. No feature overload. Just the workflow you actually use.</p>
            </section>

            <div className="comparison-grid">
              {/* Old Way */}
              <div className="comparison-card old-way">
                <h3 className="comparison-title">The old way</h3>
                <ul className="comparison-list">
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Negative indicator" src="/div1.svg" />
                    <span>Too many features, too many clicks</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Negative indicator" src="/div1.svg" />
                    <span>Setup takes longer than the work</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Negative indicator" src="/div1.svg" />
                    <span>Messy views and noisy notifications</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Negative indicator" src="/div1.svg" />
                    <span>Tools that feel like a second job</span>
                  </li>
                </ul>
              </div>

              {/* PlanClock Way */}
              <div className="comparison-card planclock-way">
                <h3 className="comparison-title">The PlanClock way</h3>
                <ul className="comparison-list">
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Positive indicator" src="/div2.svg" />
                    <span>Create tasks in seconds</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Positive indicator" src="/div2.svg" />
                    <span>Assign teammates and set priority</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Positive indicator" src="/div2.svg" />
                    <span>Track work in List or Kanban</span>
                  </li>
                  <li className="comparison-item">
                    <img className="comparison-icon" alt="Positive indicator" src="/div2.svg" />
                    <span>Discuss work where it happens, in comments</span>
                  </li>
                </ul>
                <button className="cta-button primary" onClick={navigateToApp} aria-label="Get started with PlanClock">
                  Get started free
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* VIEWS SECTION */}
        <section className="views-section">
          <div className="section-container">
            <section className="section-header">
              <div className="section-tag">VIEWS</div>
              <h2 className="section-title">Two views, zero confusion</h2>
              <p className="section-subtitle">Use a clean task list for planning and a Kanban board for execution.</p>
            </section>

            <div className="views-grid">
              {/* List View Card */}
              <article className="view-card">
                <img className="view-image" loading="lazy" alt="Task list view" src="/Projects-Project-Issue-List-Kanban-1@2x.png" />
                <div className="view-content">
                  <div className="view-header">
                    <h3 className="view-title">Task List</h3>
                    <p className="view-description">Sort by priority, filter by assignee, and see what matters today.</p>
                  </div>
                  <ul className="view-features">
                    <li className="feature-item">
                      <img className="feature-icon" alt="Assignees icon" src="/i4.svg" />
                      <span>Assignees</span>
                    </li>
                    <li className="feature-item">
                      <img className="feature-icon" alt="Priorities icon" src="/i5.svg" />
                      <span>Priorities</span>
                    </li>
                    <li className="feature-item">
                      <img className="feature-icon" alt="Due dates icon" src="/i6.svg" />
                      <span>Due dates</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Kanban View Card */}
              <article className="view-card">
                <img className="view-image" loading="lazy" alt="Kanban board view" src="/div3@2x.png" />
                <div className="view-content">
                  <div className="view-header">
                    <h3 className="view-title">Kanban Board</h3>
                    <p className="view-description">Move tasks across simple columns to keep momentum visible.</p>
                  </div>
                  <ul className="view-features">
                    <li className="feature-item">
                      <img className="feature-icon" alt="Drag and drop icon" src="/i7.svg" />
                      <span>Drag and drop</span>
                    </li>
                    <li className="feature-item">
                      <img className="feature-icon" alt="Status columns icon" src="/i8.svg" />
                      <span>Status columns</span>
                    </li>
                    <li className="feature-item">
                      <img className="feature-icon" alt="Quick edits icon" src="/i9.svg" />
                      <span>Quick edits</span>
                    </li>
                  </ul>
                </div>
              </article>
            </div>

            <p className="views-footer">Switch views instantly, no setup required.</p>
          </div>
        </section>

        {/* COLLABORATION SECTION */}
        <section className="collaboration-section">
          <div className="section-container">
            <section className="section-header">
              <div className="section-tag">COLLABORATION</div>
              <h2 className="section-title">Just enough teamwork features</h2>
              <p className="section-subtitle">Invite your team, assign tasks, and keep context in comments.</p>
              <button className="cta-button primary" onClick={navigateToApp} aria-label="Get started with PlanClock">
                Get started free
              </button>
            </section>

            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-card-icon">
                  <img className="feature-card-img" loading="lazy" alt="Invite teammates illustration" src="/div4.svg" />
                </div>
                <div className="feature-card-content">
                  <h3 className="feature-card-title">Invite teammates</h3>
                  <p className="feature-card-description">Add people to your workspace in minutes.</p>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-card-icon">
                  <img className="feature-card-img" loading="lazy" alt="Assign and prioritize illustration" src="/div5.svg" />
                </div>
                <div className="feature-card-content">
                  <h3 className="feature-card-title">Assign and prioritize</h3>
                  <p className="feature-card-description">Make ownership clear, keep focus on what's next.</p>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-card-icon">
                  <img className="feature-card-img" loading="lazy" alt="Comments on tasks illustration" src="/div6.svg" />
                </div>
                <div className="feature-card-content">
                  <h3 className="feature-card-title">Comments on tasks</h3>
                  <p className="feature-card-description">Discuss work in one thread, right where decisions happen.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="testimonials-section">
          <div className="section-container">
            <section className="section-header">
              <h2 className="section-title">Why teams choose PlanClock</h2>
              <p className="section-subtitle">Because it feels calm, fast, and easy to adopt.</p>
            </section>

            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <article key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <img className="testimonial-avatar" alt="User avatar" src="/i10.svg" />
                    <p className="testimonial-text">{testimonial.quote}</p>
                  </div>
                  <div className="testimonial-footer">
                    <div className="testimonial-initials">{testimonial.initials}</div>
                    <div className="testimonial-author">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section">
          <div className="section-container">
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-list">
              {faqItems.map((item) => (
                <article key={item.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFaqItem(item.id)}
                    aria-expanded={!!expandedFaqItems[item.id]}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <img
                      className={`faq-toggle-icon${expandedFaqItems[item.id] ? ' expanded' : ''}`}
                      loading="lazy"
                      alt="Toggle"
                      src="/i11.svg"
                    />
                  </button>
                  {expandedFaqItems[item.id] && (
                    <div id={`faq-answer-${item.id}`} className="faq-answer">
                      <p className="faq-answer-text">{item.answer}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Keep projects moving without the busywork</h2>
              <p className="cta-subtitle">List, Kanban, assignments, priorities, comments. That's it.</p>
            </div>
            <div className="cta-actions">
              <button className="cta-button primary" onClick={navigateToApp} aria-label="Get started with PlanClock free">
                Get started free
              </button>
              <button className="cta-button secondary" onClick={navigateToApp} aria-label="Sign in to PlanClock">
                Sign in
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer" role="contentinfo">
          <div className="footer-container">
            <div className="footer-content">
              <p className="footer-copyright">© 2026 PlanClock.com. All rights reserved.</p>

            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
