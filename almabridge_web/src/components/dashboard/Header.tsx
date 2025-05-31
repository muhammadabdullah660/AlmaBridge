"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { Search, Bell, Sun, ChevronDown, Moon } from "lucide-react";
import { notifications } from "@/data";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function Header() {

    const [isDark, setIsDark] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const router = useRouter();

    const fetchUser = useCallback(() => {
          try {
            const userFirstName = localStorage.getItem("firstName") ?? "";
            const userEmail = localStorage.getItem("email") ?? "";
            setFirstName(userFirstName);
            setEmail(userEmail);
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load user profile");
          }
        }, []);
    
    useEffect(() => {
        fetchUser()
    }, [fetchUser])


    const toggleTheme = () => {
        // Still Add Logic to convert theme
        setIsDark(!isDark);
    }

    const handleRoute = (path: string): void => {
        if (path === '/') {
            clearAllCookies();
        }
        setIsProfileOpen(false);
        router.push(path);
    }

    const handleClickEvent = (event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
    }

    useEffect(() => {
        // Add event listener when component mount
        document.addEventListener("mousedown", handleClickEvent);

        // Cleanup event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickEvent);
        };
    }, []);

    const clearAllCookies = () => {
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
    };


    return (
        <header className="h-16 border-b border-white/10 bg-black flex items-center md:justify-between justify-end px-4 md:px-6">
            <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/20"
                />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <div className="relative">
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image src="/assets/placeholder.svg" alt="Profile" width={32} height={32} className="object-cover" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </Button>
                </div>
            </div>

            <AnimatePresence>
                {isNotificationsOpen && (
                    <motion.div
                        className="absolute top-16 right-4 md:right-6 w-80 mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        ref={notificationRef}
                    >
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                            <div className="flex items-start">
                            {notification.unread && <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2" />}
                            <div>
                                <h4 className="font-medium">{notification.title}</h4>
                                <p className="text-sm text-gray-400">{notification.message}</p>
                                <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <Button variant="ghost" className="w-full text-sm">
                            View all notifications
                        </Button>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        className="absolute top-16 right-4 md:right-6 w-64 mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        ref={profileRef}
                    >
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image src="/assets/placeholder.svg" alt="Profile" width={40} height={40} className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{firstName}</h4>
                            <p className="text-sm text-gray-400 truncate">{email}</p>
                        </div>
                        </div>
                    </div>
                    <nav className="p-2">
                        <Button onClick={() => handleRoute('/dashboard/profile')} variant="ghost" className="w-full justify-start text-left">
                            View Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-left">
                            Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-left">
                            Help & Support
                        </Button>
                        <Button onClick={() => handleRoute('/')} variant="ghost" className="w-full justify-start text-left text-red-400">
                            Sign Out
                        </Button>
                    </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}