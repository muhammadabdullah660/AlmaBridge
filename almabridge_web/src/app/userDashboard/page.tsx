import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UserDashboard from "@/components/userDashboard";
export default function UserDashboardPage() {
  return (
    <div>
      <Navbar />
        <UserDashboard/>
      <Footer />
    </div>
  );
}
