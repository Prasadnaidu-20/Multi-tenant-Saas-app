import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, getToken, logout } from "../../lib/auth";
import { 
  User, 
  Building2, 
  Zap, 
  Plus, 
  FileText, 
  Settings, 
  LogOut, 
  Crown, 
  Shield, 
  Edit3, 
  Eye, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Clock,
  Save,
  X
} from "lucide-react";


const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; tenantId: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const token = typeof window !== 'undefined' ? getToken() : null;

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchNoteCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNoteCount(data.planInfo.current);
      }
    } catch (error) {
      console.error('Error fetching note count:', error);
    }
  };

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
    fetchNoteCount();
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();
  };

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

    await res.json();
    alert('Note created successfully!');
    setTitle('');
    setContent('');
    setShowCreateForm(false);
    fetchNoteCount();
    router.push("/notes");
  };

  const handleUpgradeToPro = async () => {
    if (!confirm("Are you sure you want to upgrade to Pro? This will give you unlimited notes!")) {
      return;
    }

    setUpgrading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/upgrade-to-pro', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setUser(data.user);
        
        alert("🎉 Successfully upgraded to Pro! You now have unlimited notes!");
        router.reload();
      } else {
        const error = await res.json();
        alert(`Error: ${error.msg}`);
      }
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      alert("Error upgrading to Pro");
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'from-red-500 to-rose-600';
      case 'Pro': return 'from-purple-500 to-violet-600';
      default: return 'from-emerald-500 to-green-600';
    }
  };

  const getPlanIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="w-4 h-4" />;
      case 'Pro': return <Crown className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          <p className="text-slate-300 text-lg">Loading your workspace...</p>
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
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(user?.role || 'Free')} rounded-2xl flex items-center justify-center`}>
                  {getPlanIcon(user?.role || 'Free')}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Welcome back, {user?.name}
                  </h1>
                  <p className="text-slate-400 flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    Ready to create something amazing?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r ${getPlanColor(user?.role || 'Free')} text-white`}>
                  {getPlanIcon(user?.role || 'Free')}
                  {user?.role === 'Member' ? 'Free Plan' : `${user?.role} Plan`}
                </div>
                {user?.role === 'Member' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <FileText className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-300 text-sm font-medium">{noteCount}/3 notes used</span>
                  </div>
                )}
                {user?.role === 'Pro' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-300 text-sm font-medium">Unlimited notes</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === "Member" && (
                <button
                  onClick={handleUpgradeToPro}
                  disabled={upgrading}
                  className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                    upgrading 
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed border-slate-600/50' 
                      : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white border-purple-400/50 hover:shadow-xl'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {upgrading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Crown className="w-4 h-4" />
                    )}
                    {upgrading ? 'Upgrading...' : 'Upgrade to Pro'}
                  </span>
                </button>
              )}
              {user?.role === "Admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-indigo-400/50 text-white"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </span>
                </button>
              )}
              <button
                onClick={handleLogout}
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
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Notes</p>
                  <p className="text-3xl font-bold text-white mt-1">{noteCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Plan Status</p>
                  <p className="text-xl font-bold text-white mt-1">{user?.role === 'Member' ? 'Free' : user?.role}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(user?.role || 'Free')} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {getPlanIcon(user?.role || 'Free')}
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Organization</p>
                  <p className="text-xl font-bold text-white mt-1">{user?.tenantId}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Last Active</p>
                  <p className="text-xl font-bold text-white mt-1">Now</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Profile Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group hover:border-white/30 transition-all duration-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(user?.role || 'Free')} rounded-2xl flex items-center justify-center text-2xl font-bold text-white`}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Profile Information</h3>
                    <p className="text-slate-400">Your account details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Full Name</p>
                      <p className="text-white font-medium">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="w-5 h-5 text-slate-400">@</span>
                    <div>
                      <p className="text-slate-400 text-sm">Email Address</p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Organization</p>
                      <p className="text-white font-medium">{user?.tenantId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    {getPlanIcon(user?.role || 'Free')}
                    <div>
                      <p className="text-slate-400 text-sm">Subscription Plan</p>
                      <p className="text-white font-medium">{user?.role === 'Member' ? 'Free Plan' : `${user?.role} Plan`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Tenant Info */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group hover:border-white/30 transition-all duration-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Security & Isolation</h3>
                    <p className="text-slate-400">Data protection details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">Tenant Isolated</span>
                    </div>
                    <p className="text-emerald-200/80 text-sm">
                      You are securely logged into the <strong>{user?.tenantId}</strong> organization. All your data is completely isolated and private.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium">End-to-End Encryption</span>
                    </div>
                    <p className="text-blue-200/80 text-sm">
                      Your notes and data are protected with enterprise-grade encryption standards.
                    </p>
                  </div>
                  {user?.role === 'Member' && noteCount >= 3 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-300 font-medium">Limit Reached</span>
                      </div>
                      <p className="text-amber-200/80 text-sm">
                        You&apos;ve reached your free plan limit. Upgrade to Pro for unlimited notes!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group hover:border-white/30 transition-all duration-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Quick Actions</h3>
                    <p className="text-slate-400">Get things done faster</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    disabled={user?.role === 'Member' && noteCount >= 3}
                    className={`group w-full flex items-center gap-3 p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                      user?.role === 'Member' && noteCount >= 3
                        ? 'bg-slate-600/30 text-slate-500 cursor-not-allowed border border-slate-600/30'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white border border-indigo-400/50 hover:shadow-xl'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    {showCreateForm ? "Cancel Creation" : "Create New Note"}
                  </button>
                  
                  <button
                    onClick={() => router.push("/notes")}
                    className="group w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-emerald-400/50"
                  >
                    <Eye className="w-5 h-5" />
                    View All Notes
                  </button>
                  
                  <button 
                    className="group w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer text-white"
                  >
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </button>
                </div>

                {/* Create Note Form */}
                {showCreateForm && (
                  <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Edit3 className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-lg font-bold text-white">Create New Note</h4>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      />
                      <textarea
                        placeholder="Write your note content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateNote}
                          className="group flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
                        >
                          <Save className="w-4 h-4" />
                          Save Note
                        </button>
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
};

export default Dashboard;