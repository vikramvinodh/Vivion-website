"use server";

export async function sendEmail(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");

    // Validate data
    if (!name || !email || !message) {
        return { success: false, message: "Missing required fields" };
    }

    // In a real application, you would use an email service provider here.
    // For now, we will log the data to the server console.
    console.log("--- NEW CONTACT FORM SUBMISSION ---");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Message:", message);
    console.log("-----------------------------------");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Email sent successfully!" };
}
