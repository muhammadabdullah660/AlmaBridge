import AsideMenu from "@/components/dashboard/AsideMenu";
import Header from "@/components/dashboard/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardLayout({children}: { children: React.ReactNode }) {

    return (
        <div className="flex h-screen bg-black text-white">
            {/* aside menu */}
            <AsideMenu />
            
            {/*  Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* header */}
                <Header />
                {/* Main scrollable content */}
                <main className="flex-1 h-screen overflow-y-auto bg-black p-6">
                    {children}
                </main>
            </div>
            <ToastContainer />
        </div>
    );
}