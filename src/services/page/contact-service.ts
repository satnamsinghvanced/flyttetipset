export async function saveContactUs(formData: any) {
    const response = await fetch('/api/contact-us-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    // console.log('response: ', response)

    if (!response.ok) {
        let errorData = { message: 'There are some network issues' };
        try {
            errorData = await response.json();
        } catch (e) {
            console.log('Failed to parse error response:', e);
            console.log('Failed to parse error response:', response.statusText);
        }
        console.log('Failed to save data:', errorData.message);
        throw new Error(errorData.message || response.statusText);
    }

    const data = await response.json();
    console.log('Success! Data saved:', data.record);
    return data;
}