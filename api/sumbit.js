export default async function handler(req, res) {
  // 1. Make sure the request is a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  // 2. Grab the name and email sent from your frontend
  const { email, name } = req.body;

  // 3. Grab your secret Google URL from Vercel's vault
  const googleUrl = process.env.GOOGLE_SCRIPT_URL;

  try {
    // 4. Send the data to Google Sheets safely from the server
    const response = await fetch(googleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Convert the data into a format Google understands
      body: new URLSearchParams({ email, name }),
    });

    // 5. Tell the frontend it was a success
    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Google Sheet failed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
