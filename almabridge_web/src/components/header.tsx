// src/components/Header.tsx
import { teamMembers } from "@/data";
import Image from "next/image";
export default function Header() {
  return (
    <>
      <div>
        {/* Coming Soon Section */}
        <header className="bg-[#0F0F0F] text-white text-center py-32 ">
          <h1 className="text-6xl mb-6 comingHeading">Coming Soon</h1>
          <p>
            From automation of people processes to creating an engaged and
            driven culture
          </p>
          <div className="flex justify-center space-x-4 mt-10">
            <div className="flex justify-center space-x-4 mt-10">
              <div className="flex justify-center space-x-4 mt-10">
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-8 h-8"
                  >
                    <path
                      fill="#2e6fe8"
                      d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-8 h-8"
                  >
                    <path
                      fill="#2e64e8"
                      d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="w-8 h-8"
                  >
                    <path
                      fill="#e82e2e"
                      d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="w-8 h-8"
                  >
                    <path
                      fill="#2e6fe8"
                      d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center items-center space-x-4">
            <div className="p-2.5">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-3 w-[354px] text-white bg-white/10 backdrop-blur-[10px] shadow-lg border-none outline-none rounded-none placeholder:text-white/60"
              />
            </div>

            <button className="bg-white ml-2 text-black font-semibold px-6 py-2 rounded-full">
              Notify Me
            </button>
          </div>
        </header>

        {/* AlmaBridge Section */}
        <section id="features" className="bg-black text-white py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#00bdd6] alma-heading">
              AlmaBridge
            </h2>
          </div>

          <div className="flex flex-wrap justify-center">
            <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
              <div className="image-container mb-4">
                <img
                  src="/assets/Container 3 (1).png"
                  alt="comment"
                  width={90}
                  height={90}
                />
              </div>
              <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                Chat with an Alumni
              </h3>
              <p className="mb-5 text-sm font-medium">
                Commodo qui nulla ipsum ea cupidatat sit aliquip
              </p>
              <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                Explore →
              </a>
            </div>
            <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
              <div className="image-container mb-4">
                <img
                  src="/assets/Container 5.png"
                  alt="users"
                  width={90}
                  height={90}
                />
              </div>
              <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                Community
              </h3>
              <p className="mb-5 text-sm font-medium">
                Commodo qui nulla ipsum ea cupidatat sit aliquip
              </p>
              <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                Explore →
              </a>
            </div>
            <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
              <div className="image-container mb-4">
                <img
                  src="/assets/Container 7.png"
                  alt="calendar"
                  width={90}
                  height={90}
                />
              </div>
              <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                Events
              </h3>
              <p className="mb-5 text-sm font-medium">
                Commodo qui nulla ipsum ea cupidatat sit aliquip
              </p>
              <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                Explore →
              </a>
            </div>
            <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
              <div className="image-container mb-4">
                <img
                  src="/assets/Container.png"
                  alt="code"
                  width={90}
                  height={90}
                />
              </div>
              <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                Hire a Talent
              </h3>
              <p className="mb-5 text-sm font-medium">
                Commodo qui nulla ipsum ea cupidatat sit aliquip
              </p>
              <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                Explore →
              </a>
            </div>
          </div>
        </section>

        {/* Unlock the Power Section */}
        <div className="bg-gray-900 text-white py-16 px-20 text-center">
          <h1 className="text-3xl">
            <span className="text-[#00BDD6] font-bold">AlmaBridge</span> unlocks
            the full
            <span className="text-[#00BDD6] font-bold"> potential</span> of the
            alumni community by fostering
            <span className="text-[#00BDD6] font-bold"> meaningful</span>{" "}
            <span className="text-[#00BDD6] font-bold">connections </span>
            between <span className="text-[#00BDD6] font-bold">
              graduates
            </span>{" "}
            and{" "}
            <span className="text-[#00BDD6] font-bold">current students</span>.
          </h1>
        </div>

        {/* Metrics Section */}
        <section className="bg-black text-white text-center py-12 px-5 font-sans metrics-container">
          {/* Heading section */}
          <div className="mb-10">
            <div className="inline-block bg-gradient-to-r from-gray-300 via-blue-700 to-cyan-500 text-transparent bg-clip-text px-3 py-1 rounded-lg text-sm font-semibold">
              METRICS
            </div>
            <h2 className="text-2xl mt-4 font-normal">
              Numbers speaking for themselves
            </h2>
          </div>

          {/* Metrics container */}
          <div className="flex flex-wrap justify-evenly items-center gap-10 px-4">
            {/* Metric item */}
            <div className="flex-1 max-w-xs text-center">
              <span className="block text-3xl font-bold text-cyan-400">0%</span>
              <p className="text-base text-gray-300 mt-2">
                Candidate match rate
              </p>
            </div>

            {/* Add additional metrics similarly */}
            <div className="flex-1 max-w-xs text-center">
              <span className="block text-3xl font-bold text-cyan-400">
                95%
              </span>
              <p className="text-base text-gray-300 mt-2">
                Alumni satisfaction rate
              </p>
            </div>

            <div className="flex-1 max-w-xs text-center">
              <span className="block text-3xl font-bold text-cyan-400">
                1200+
              </span>
              <p className="text-base text-gray-300 mt-2">Active connections</p>
            </div>
          </div>
        </section>

        {/*Meet the team*/}

        <section
          id="team"
          className="team-section text-center py-12 bg-[#191919]"
        >
          <h2 className="text-3xl font-semibold text-[#00BDD6] mb-8">
            Meet the Team
          </h2>
          <div className="flex justify-center items-center py-12 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="text-center bg-black-700 p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-2xl"
                >
                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-[#00bdd6]">
                    <Image
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h3 className="text-xl text-white mb-2">{member.name}</h3>
                  <p className="text-lg text-gray-600">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*FAQ */}

        <section id="faq" className="bg-black text-white py-24">
          <div className="text-center mb-12">
            <span className="bg-gradient-to-r from-gray-200 via-blue-600 to-gray-200 px-4 py-1 rounded-full text-transparent bg-clip-text">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h1 className="text-4xl font-bold mt-4 text-cyan-400">
              We&apos;ve got you covered!
            </h1>
          </div>
          <div className="container mx-auto space-y-4 px-8">
            <details className="border-gray-600 group">
              <summary className="flex justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 group-open:bg-gray-700 group-open:text-white rounded-lg">
                <h3 className="text-lg">
                  Does this app offer a free trial period?
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 transform group-open:rotate-180 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 11.41l7 7 7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p>
                  All individual Framer subscriptions have been grandfathered
                  into a Pro plan at your existing rate...
                </p>
              </div>
            </details>

            {/* Additional FAQ items */}
            <details className="border-gray-600 group">
              <summary className="flex justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 group-open:bg-gray-700 group-open:text-white rounded-lg">
                <h3 className="text-lg">What payment methods do you offer?</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 transform group-open:rotate-180 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 11.41l7 7 7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p>
                  We offer various payment methods including credit cards and
                  PayPal.
                </p>
              </div>
            </details>

            <details className="border-gray-600 group">
              <summary className="flex justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 group-open:bg-gray-700 group-open:text-white rounded-lg">
                <h3 className="text-lg">How much does a subscription cost?</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 transform group-open:rotate-180 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 11.41l7 7 7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p>
                  Subscription costs depend on the plan you choose. Please check
                  our website for the latest pricing.
                </p>
              </div>
            </details>

            <details className="border-gray-600 group">
              <summary className="flex justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 group-open:bg-gray-700 group-open:text-white rounded-lg">
                <h3 className="text-lg">What is your refund policy?</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 transform group-open:rotate-180 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 11.41l7 7 7-7"
                  />
                </svg>
              </summary>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p>We offer a 30-day refund policy on all subscriptions.</p>
              </div>
            </details>
          </div>
        </section>

        <section className="mb-16">
          {/*BECOME A PART SECTION*/}
          <section>
            <div className="bg-gradient-to-r from-gray-200 via-blue-700 to-cyan-500 bg-cover bg-center flex justify-start items-center text-white rounded-[30px] p-6 md:p-8 lg:p-2 shadow-lg max-w-7xl mx-auto">
              <div className="text-left space-y-4 px-4 pt-8 pb-8 md:space-y-6 sm:px-6 sm:pt-6 sm:pb-6">
                <h1 className="text-2xl font-semibold md:text-xl sm:text-lg">
                  BECOME A PART OF ALMABRIDGE
                </h1>
                <p className="text-sm md:text-base sm:text-xs">
                  Discover why hiring managers prefer Hirevision over the
                  competition and what makes it the easiest, most powerful video
                  interviewing platform on the market.
                </p>
                <button className="text-white text-xs md:text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-800 to-cyan-500 uppercase font-bold text-center cursor-pointer transition-all duration-300 block mx-auto h-10 hover:from-blue-700 hover:to-cyan-400">
                  Register Now →
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
