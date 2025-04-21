import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import QuotationAndMetrics from "@/components/QuotationAndMetrics";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <QuotationAndMetrics />
      <Team />
      <FAQ />
      <Footer />
    </div>
  )
}
