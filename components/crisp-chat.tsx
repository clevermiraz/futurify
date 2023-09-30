"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export default function CrispChat() {
    useEffect(() => {
        Crisp.configure("66ebc4b4-262b-40e4-9134-ec815e0794a5");
    }, []);

    return null;
}
