"use client";

import { ProModal } from "@/components/pro-modal";
import { useEffect, useState } from "react";

export default function ModalProvider() {
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <ProModal />
        </>
    );
}
