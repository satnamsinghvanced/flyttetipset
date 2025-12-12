export async function saveUserData(formData: any) {
  const response = await fetch("/api/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dynamicFields: formData }),
  });

  if (!response.ok) {
    let errorData = { message: "Network response was not ok." };
    try {
      errorData = await response.json();
    } catch (e) {
      console.log("Failed to parse error response:", e);
    }
    console.log("Failed to save data:", errorData.message);
    throw new Error(errorData.message || response.statusText);
  }

  const data = await response.json();
  console.log("Success! Data saved:", data);
  return data;
}
