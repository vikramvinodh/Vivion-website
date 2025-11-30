import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

// EmailJS Configuration
const SERVICE_ID = "service_d0lt13g";
const TEMPLATE_ID = "template_0al9jyn";
const PUBLIC_KEY = "Z6FDkpajJBIRIRBmy";

export function useEmailForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const formRef = useRef<HTMLFormElement>(null);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        if (!formRef.current) return;

        emailjs
            .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
                publicKey: PUBLIC_KEY,
            })
            .then(
                () => {
                    setStatus("success");
                    formRef.current?.reset();
                    // Reset success status after 5 seconds to allow re-submission if needed
                    setTimeout(() => setStatus("idle"), 5000);
                },
                (error) => {
                    console.error("FAILED...", error.text);
                    setStatus("error");
                },
            );
    };

    return {
        status,
        formRef,
        sendEmail,
        setStatus // Exported to allow manual reset if needed
    };
}
