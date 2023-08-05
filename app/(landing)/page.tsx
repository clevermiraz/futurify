import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
    return (
        <>
            <h1 className="text-3xl text-red-500">Hello From Landing</h1>
            <Link href="/sign-in">
                <Button variant="outline" size={"sm"}>
                    Sign In
                </Button>
            </Link>

            <Link href="/sign-up">
                <Button variant="outline" size={"sm"}>
                    Sign Up
                </Button>
            </Link>
        </>
    );
}