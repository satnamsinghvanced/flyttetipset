export async function getSelectedForm(formSelectId: string) {
    const response = await fetch(
        `/api/get-steped-form?formSelectId=${encodeURIComponent(formSelectId)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        let errorData = { message: "Network response was not ok." };
        try {
            errorData = await response.json();
        } catch (e) {
            console.log("Failed to parse error response:", e);
        }
        throw new Error(errorData.message || response.statusText);
    }

    return await response.json();
}
