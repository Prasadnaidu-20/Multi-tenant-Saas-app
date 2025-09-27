import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, getToken, logout } from "../../lib/auth";
import { API_BASE } from "../../lib/api";
import { 
  Users, 
  Plus, 
  Mail, 
  LogOut, 
  Shield, 
  Crown, 
  User, 
  Search,
  Filter,
  UserPlus,
  Send,
  Loader2,
  Check,
  X,
  Building2
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  tenantId: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    console.log("Admin dashboard component loaded");
    const token = getToken();
    const userData = getCurrentUser();
    
    if (!token || !userData) {
      console.log("No token or user data, redirecting to login");
      router.push("/login");
      return;
    }

    // Redirect non-admin users to regular dashboard
    if (userData.role !== "Admin") {
      console.log("User is not admin, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    console.log("Admin user confirmed:", userData);
    setUser(userData as unknown as AdminUser);
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/auth/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data);
        setNewUser({ name: "", email: "", password: "", role: "Member" });
        setShowCreateForm(false);
        fetchUsers();
        // Success notification (you can replace alert with toast)
        alert("User created successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.msg}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const inviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/admin/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });

      if (response.ok) {
        setInviteEmail("");
        setShowInviteForm(false);
        alert("Invitation sent successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.msg}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Error sending invite");
    }
  };


  const updateUserToPro = async (userId: string, userName: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: "Pro" })
      });

      if (response.ok) {
        alert(`${userName} has been upgraded to Pro!`);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Error: ${error.msg}`);
      }
    } catch (error) {
      console.error("Error updating user to Pro:", error);
      alert("Error updating user to Pro");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="w-4 h-4" />;
      case 'Pro': return <Crown className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'from-red-500 to-rose-600 text-white';
      case 'Pro': return 'from-purple-500 to-violet-600 text-white';
      default: return 'from-emerald-500 to-green-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          <p className="text-slate-300 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-slate-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Managing {user?.tenantId} organization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-indigo-400/50"
              >
                <span className="flex items-center gap-2 text-white">
                  <Plus className="w-4 h-4" />
                  Create User
                </span>
              </button>

              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="group relative px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-white">
                  <Mail className="w-4 h-4" />
                  Invite User
                </span>
              </button>

              <button
                onClick={logout}
                className="group relative px-6 py-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-red-400/30 hover:border-red-400/50 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-red-300 hover:text-red-200">
                  <LogOut className="w-4 h-4" />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Pro Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{users.filter(u => u.role === 'Pro').length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Admins</p>
                  <p className="text-3xl font-bold text-white mt-1">{users.filter(u => u.role === 'Admin').length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Create User Form */}
          {showCreateForm && (
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8 animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create New User</h2>
              </div>
              <form onSubmit={createUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Create password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="Member" className="bg-slate-800">Member</option>
                      <option value="Admin" className="bg-slate-800">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <Check className="w-4 h-4" />
                      Create User
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <X className="w-4 h-4" />
                      Cancel
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Invite User Form */}
          {showInviteForm && (
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8 animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Invite User</h2>
              </div>
              <form onSubmit={inviteUser} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="Enter email to invite"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <Send className="w-4 h-4" />
                      Send Invite
                    </span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowInviteForm(false)} 
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <X className="w-4 h-4" />
                      Cancel
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-800">All Roles</option>
                  <option value="Admin" className="bg-slate-800">Admin</option>
                  <option value="Pro" className="bg-slate-800">Pro</option>
                  <option value="Member" className="bg-slate-800">Member</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="w-6 h-6" />
                Team Members ({filteredUsers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-white/5 transition-colors duration-200 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-lg">{user.name}</div>
                            <div className="text-slate-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {user.role === 'Member' ? (
                          <button 
                            onClick={() => updateUserToPro(user._id, user.name)}
                            className="group relative px-6 py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer text-white text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              Upgrade to Pro
                            </span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-sm font-medium">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Custom cursor effect */}
      <div 
        className="fixed w-6 h-6 border border-indigo-400/50 rounded-full pointer-events-none z-50 transition-transform duration-150 mix-blend-difference"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x || mousePosition.y ? 1 : 0})`
        }}
      ></div>
    </div>
  );
}