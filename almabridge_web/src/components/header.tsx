// src/components/Header.tsx

export default function Header() {


  const teamMembers = [
    { name: "Muhammad Abdullah", position: "Lead Developer" },
    { name: "Zoya Naveed", position: "Lead Developer" },
    { name: "Shahzaib Ijaz", position: "Lead Developer" },
    { name: "Fatima Awais", position: "Lead Developer" },
  ];

  return (
    <>
      <div>
        {/* Coming Soon Section */}
        <header className="bg-[#0F0F0F] text-white text-center py-32">
          <h1 className="text-6xl mb-6 comingHeading">Coming Soon</h1>
          <p className="">From automation of people processes to creating an engaged and driven culture</p>

          <div className="flex justify-center space-x-4 mt-10">

            <div className="icons-fws">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2e6fe8" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" /></svg>              </div>

            <div className="icons-fws">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2e64e8" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" /></svg>

            </div>
            <div className="icons-fws">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#e82e2e" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>

            </div>
            <div className="icons-fws">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#2e6fe8" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg>

            </div>

          </div>

          <div className="mt-10 flex justify-center inputdiv">
            <input
              type="email"
              placeholder="Email"
              className="inputEmail"
            />
            <button className="bg-blue-600 px-6 py-2 text-white notifbutton">
              Notify Me
            </button>
          </div>
        </header>

        {/* Alma Bridge Section */}
        <section className="bg-black text-white py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#00BDD6] alma-heading">ALMA BRIDGE</h2>
          </div>

          <div className="card-container">
            <div className="card">
              <div className="image-container">
                <img
                  src="/assets/Container 3 (1).png"
                  alt="comment"
                  width={90} height={90} />
              </div>

              <h3>Chat with an Alumni</h3>
              <p>Commodo qui nulla ipsum ea cupidatat sit aliquip</p>
              <a href="#">Explore →</a>
            </div>
            <div className="card">
              <div className="image-container">
                <img
                  src="/assets/Container 5.png"
                  alt="users"
                  width={90} height={90} />
              </div>

              <h3>Community</h3>
              <p>Commodo qui nulla ipsum ea cupidatat sit aliquip</p>
              <a href="#">Explore →</a>
            </div>
            <div className="card">
              <div className="image-container">
                <img
                  src="/assets/Container 7.png"
                  alt="calender"
                  width={90} height={90} />
              </div>

              <h3>Events</h3>
              <p>Commodo qui nulla ipsum ea cupidatat sit aliquip</p>
              <a href="#">Explore →</a>
            </div>

            <div className="card">
              <div className="image-container">
                <img
                  src="/assets/Container.png"
                  alt="code"
                  width={90} height={90} />
              </div>

              <h3>Hire a Talent</h3>
              <p>Commodo qui nulla ipsum ea cupidatat sit aliquip</p>
              <a href="#">Explore →</a>
            </div>
          </div>
        </section>


        {/* Unloc the power text section */}
        <div className="text-container highlight-text-container">
          <h1 className="highlight-text">
            <span className="highlight">AlmaBridge</span> unlocks the full
            <span className="highlight"> potential</span> of the alumni community
            by fostering <span className="highlight">meaningful</span> <span className="highlight">connections </span>
            between <span className="highlight">graduates </span> and <span className="highlight">current students </span>
          </h1>
        </div>

        <section>
          <div className="metrics-section">
            <div className="metrics-heading">
              <div className="bg-metric">
                <span className="badge">METRICS</span>
              </div>
              <h2>Numbers speaking for themselves</h2>
            </div>

            <div className="metrics-container">
              <div className="metric-item">
                <span className="metric-number">0%</span>
                <p className="metric-text">Candidate match rate</p>
              </div>
              <div className="metric-item">
                <span className="metric-number">0</span>
                <p className="metric-text">Students</p>
              </div>
              <div className="metric-item">
                <span className="metric-number">0</span>
                <p className="metric-text">Alumni</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-members">
            <div className="team-member">
              <div className="image-container">
              <img src="image1.jpg" alt="Zoya Naveed" />
                </div>
              
              <h3>Zoya Naveed</h3>
              <p>DEVELOPER</p>
            </div>
            <div className="team-member">
              <div className="image-container">
              <img src="/assets/f.jpg" alt="Fatima Awais" />
              </div>
              <h3>Fatima Awais</h3>
              <p>DEVELOPER</p>
            </div>

          </div>
          <div className="team-members">
            <div className="team-member">
              <div className="image-container">
              <img src="image1.jpg" alt="Muhammad Abdullah" />
                </div>
              <h3>Muhammad Abdullah</h3>
              <p>DEVELOPER</p>
            </div>
            <div className="team-member">
              <div className="image-container">
              <img src="image2.jpg" alt="Shahzaib Ijaz" />

                </div>
              <h3>Shahzaib Ijaz</h3>
              <p>DEVELOPER</p>
            </div>

          </div>
        </section>
        {/*FAQ SECTION*/}
        <section>
          <div className="faq-heading">
            <span className="faq-badge">FREQUENTLY ASKED QUESTIONS</span>
            <h1 className="mt-4">We've got you covered!</h1>
          </div>
          <div className="container mx-auto faq-container">
            <details className="border-gray-200 group">
              <summary className="flex justify-between p-4 cursor-pointer group-open:bg-[#333333] group-open:text-white">
                <h3 className="text-lg">Does this app offer a free trial period?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 transform group-open:rotate-180 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.41l7 7 7-7" />
                </svg>
              </summary>
              <div className="p-4 group-open:bg-[#333333] group-open:text-white">
                <p>All individual Framer subscriptions have been grandfathered into a Pro plan at your existing rate. If you were on a Small Team plan, then all 5 seats have been converted over to Pro seats at your existing rate. Regardless of your subscription plan, all new paid editors that you add to your subscription will be billed at the new plan rates.</p>
              </div>
            </details>

            <details className="border-gray-200 group">
              <summary className="flex justify-between p-4 cursor-pointer group-open:bg-[#333333] group-open:text-white">
                <h3 className="text-lg">What payment methods do you offer?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 transform group-open:rotate-180 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.41l7 7 7-7" />
                </svg>
              </summary>
              <div className="p-4 group-open:bg-[#333333] group-open:text-white">
                <p>We offer various payment methods including credit cards and PayPal.</p>
              </div>
            </details>

            <details className="border-gray-200 group">
              <summary className="flex justify-between p-4 cursor-pointer group-open:bg-[#333333] group-open:text-white">
                <h3 className="text-lg">How much does a subscription cost?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 transform group-open:rotate-180 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.41l7 7 7-7" />
                </svg>
              </summary>
              <div className="p-4 group-open:bg-[#333333] group-open:text-white">
                <p>Subscription costs depend on the plan you choose. Please check our website for the latest pricing.</p>
              </div>
            </details>

            <details className="border-gray-200 group">
              <summary className="flex justify-between p-4 cursor-pointer group-open:bg-[#333333] group-open:text-white">
                <h3 className="text-lg">What is your refund policy?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 transform group-open:rotate-180 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.41l7 7 7-7" />
                </svg>
              </summary>
              <div className="p-4 group-open:bg-[#333333] group-open:text-white">
                <p>We offer a 30-day refund policy on all subscriptions.</p>
              </div>
            </details>
          </div>


        </section>
        <section>
          {/*BECOME A PART SECTION*/}
          <section>
            <div className="banner-container">
              <div className="banner">
                <div className="banner-content">
                  <div className="banner-para">
                    <h1 className="text-3xl md:text-2xl sm:text-xl">BECOME A PART OF ALMABRIDGE</h1>
                    <p className="text-lg md:text-md sm:text-sm">Discover why hiring managers prefer Hirevision over the competition and what makes it the easiest, most powerful video interviewing platform on the market.</p>
                  </div>
                  <button className="register-button">Register Now →</button>
                </div>
              </div>
            </div>
          </section>
        </section>

      </div >
    </>

  );
}
