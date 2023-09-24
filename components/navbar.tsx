import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { UserButton } from "@clerk/nextjs";

export default async function Navbar() {
    const apiLimitCount = await getApiLimitCount();

    return (
        <>
            <div className="flex items-center">
                <MobileSidebar apiLimitCount={apiLimitCount} />
                <div className="flex w-full justify-end">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </>
    );
}
