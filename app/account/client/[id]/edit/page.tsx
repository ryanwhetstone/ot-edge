"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingClient, setFetchingClient] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  useEffect(() => {
    async function loadClient() {
      const resolvedParams = await params;
      setClientId(resolvedParams.id);

      try {
        const res = await fetch(`/api/clients/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch client");
        }
        const client = await res.json();
        setFormData({
          firstName: client.firstName,
          lastName: client.lastName,
          birthDate: new Date(client.birthDate).toISOString().split('T')[0],
        });
      } catch (err) {
        setError("Failed to load client information");
        toast.error("Failed to load client information");
      } finally {
        setFetchingClient(false);
      }
    }

    loadClient();
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const toastId = toast.loading("Updating client...");

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to update client");
        toast.error(result.error || "Failed to update client", { id: toastId });
        return;
      }

      toast.success("Client updated successfully", { id: toastId });
      router.push(`/account/client/${clientId}`);
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  if (fetchingClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <p>Loading client information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href={`/account/client/${clientId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Client
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Edit Client</h1>
          <p className="mt-2 text-gray-600">
            Update client information
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium">
                Birth Date
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="mt-1 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating..." : "Update Client"}
              </button>
              <Link
                href={`/account/client/${clientId}`}
                className="flex-1 rounded border border-gray-300 py-2 text-center font-medium hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
