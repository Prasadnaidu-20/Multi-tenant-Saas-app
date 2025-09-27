import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, getToken, logout } from "../../lib/auth";

type Note = {
  _id: string;
  title: string;
  content: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const token = typeof window !== 'undefined' ? getToken() : null;

  useEffect(() => {
    console.log("Dashboard component loaded");
    const token = getToken();
    const userData = getCurrentUser();
    
    if (!token || !userData) {
      console.log("No token or user data, redirecting to login");
      router.push("/login");
      return;
    }

    console.log("User data found:", userData);
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) return <div>Loading...</div>;

  const handleLogout = () => {
    logout();
  };

  // Handle creating a note
  const handleCreateNote = async () => {
    if (!title || !content) return alert("Please enter title and content");

    const res = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    const newNote = await res.json();
    alert('Note created successfully!');
    setTitle('');
    setContent('');
    setShowCreateForm(false);
    router.push("/NotesPage"); // optional: redirect to notes page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="space-x-4">
              {user?.role === "Admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                <div className="mt-4 space-y-2">
                  <p><span className="font-semibold">Name:</span> {user.name}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Tenant:</span> {user.tenantId}</p>
                  <p><span className="font-semibold">Role:</span> {user.role || "Member"}</p>
                </div>
              </div>
            </div>

            {/* Tenant Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Tenant Information</h3>
                <div className="mt-4">
                  <p className="text-gray-600">You are currently logged in to the <strong>{user.tenantId}</strong> tenant.</p>
                  <p className="text-sm text-gray-500 mt-2">All your data is isolated to this tenant.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    {showCreateForm ? "Cancel" : "Create Note"}
                  </button>
                  <button
                    onClick={() => router.push("/NotesPage")}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    View Notes
                  </button>
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                    Settings
                  </button>
                </div>

                {/* Create Note Form */}
                {showCreateForm && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <textarea
                      placeholder="Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <button
                      onClick={handleCreateNote}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
