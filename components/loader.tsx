import Image from "next/image";

export default function Loader() {
    return (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <div className="h-full flex flex-col gap-y-4 items-center justify-center">
                <div className="w-10 h-10 relative animate-spin">
                    <Image alt="Logo" src="/logo.png" fill />
                </div>
                <p className="text-sm text-muted-foreground">
                    Fututify is thinking...
                </p>
            </div>
        </div>
    );
}
