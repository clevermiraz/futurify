import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import MobileSidebar from "@/components/mobile-sidebar";

export default function Navbar() {
    return (
        <>
            <div className="flex items-center">
                <MobileSidebar />
                <div className="flex w-full justify-end">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </>
    );
}
