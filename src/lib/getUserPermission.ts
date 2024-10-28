/**
 * Fetch user data based on email.
 *
 * @param {string} email - The email of the user to fetch data for.
 * @returns {Promise<any>} The user data.
 * @throws Will throw an error if the fetch operation fails.
 */
export async function fetchUser(email: string): Promise<any> {
  const response = await fetch("/api/prisma-user-perms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
}
