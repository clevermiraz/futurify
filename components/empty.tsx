import Image from "next/image";

interface EmptyProps {
    label: string;
}

export default function Empty({ label }: EmptyProps) {
    return (
        <>
            <div className="text-center text-gray-500">{label}</div>
            <div className="flex justify-center items-center">
                <Image src="/empty.png" alt="empty" width={200} height={200} />
            </div>
        </>
    );
}
