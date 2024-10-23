// src/components/Header.tsx

export default function Header() {
  const teamMembers = [
    { name: "Muhammad Abdullah", position: "Lead Developer" },
    { name: "Zoya Naveed", position: "Lead Developer" },
    { name: "Shahzaib Ijaz", position: "Lead Developer" },
    { name: "Fatima Awais", position: "Lead Developer" },
  ];

  return (
    <div>
      {/* Coming Soon Section */}
      <header className="bg-[#0F0F0F] text-white text-center py-32">
        <h1 className="text-6xl font-bold mb-6">Coming Soon</h1>
        <div className="flex justify-center space-x-4 mt-8">
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-twitter text-3xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-facebook text-3xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-instagram text-3xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-youtube text-3xl"></i>
          </a>
        </div>
        <div className="mt-10 flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-md text-black w-64"
          />
          <button className="bg-blue-600 px-6 py-2 rounded-r-md text-white">
            Notify Me
          </button>
        </div>
      </header>

      {/* Alma Bridge Section */}
      <section className="bg-[#171717] text-white py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#00A7E1]">ALMA BRIDGE</h2>
          <p className="mt-6 text-lg text-gray-400">
            AlmaBridge unlocks the full potential of the alumni community by
            fostering meaningful connections between graduates and current
            students.
          </p>
        </div>

        <div className="flex justify-center space-x-8">
          <div className="bg-[#202020] p-8 rounded-lg text-center">
            <i className="fas fa-network-wired text-5xl text-[#00A7E1]"></i>
            <h3 className="mt-6 text-lg font-bold">Networking</h3>
          </div>
          <div className="bg-[#202020] p-8 rounded-lg text-center">
            <i className="fas fa-briefcase text-5xl text-[#00A7E1]"></i>
            <h3 className="mt-6 text-lg font-bold">Career Growth</h3>
          </div>
          <div className="bg-[#202020] p-8 rounded-lg text-center">
            <i className="fas fa-book text-5xl text-[#00A7E1]"></i>
            <h3 className="mt-6 text-lg font-bold">Learning</h3>
          </div>
        </div>

        <div className="mt-16 flex justify-center space-x-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-[#00A7E1]">75%</h3>
            <p className="mt-2 text-gray-400">Alumni Engaged</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-[#00A7E1]">4,000+</h3>
            <p className="mt-2 text-gray-400">Connections Made</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-[#00A7E1]">500+</h3>
            <p className="mt-2 text-gray-400">Opportunities Shared</p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="bg-[#171717] text-white py-24">
        <h2 className="text-center text-4xl font-bold text-[#00A7E1] mb-12">
          MEET THE TEAM
        </h2>
        <div className="flex justify-center space-x-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src="/path-to-image.jpg" // Add your team images here
                alt={member.name}
                className="rounded-full w-36 h-36 object-cover mx-auto"
              />
              <h3 className="mt-6 text-lg font-bold">{member.name}</h3>
              <p className="mt-1 text-gray-400">{member.position}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#00A7E1] text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-8">Become a Part of AlmaBridge</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 w-80 rounded text-black"
          />
          <div className="flex justify-center">
            <button className="bg-white text-[#00A7E1] px-6 py-3 rounded button">
              Join Now
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
