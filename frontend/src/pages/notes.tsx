import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar, 
  User, 
  Crown, 
  Shield, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const NotesPage = () => {
  const router = useRouter();
  
  type Note = {
    _id: string;
    title: string;
    content: string;
    createdBy: string | { _id: string; name: string; email: string };
    createdAt: string;
  };

  type PlanInfo = {
    plan: string;
    limit: number | string;
    current: number;
    remaining: number | string;
  };

  const [notes, setNotes] = useState<Note[]>([]);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      setNotes(data.notes);
      setPlanInfo(data.planInfo);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      });

      if (res.ok) {
        const data = await res.json();
        setNotes([...notes, data]);
        setNewNote({ title: '', content: '' });
        setShowCreateForm(false);
        fetchNotes();
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Failed to create note');
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setNotes(notes.filter(note => note._id !== noteId));
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setEditForm({ title: note.title, content: note.content });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditForm({ title: '', content: '' });
  };

  const updateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        const updatedNote = await res.json();
        setNotes(notes.map(note => 
          note._id === editingNote._id ? updatedNote : note
        ));
        setEditingNote(null);
        setEditForm({ title: '', content: '' });
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const filteredAndSortedNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Pro': return 'from-purple-500 to-violet-600';
      case 'Admin': return 'from-red-500 to-rose-600';
      default: return 'from-emerald-500 to-green-600';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Pro': return <Crown className="w-4 h-4" />;
      case 'Admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          <p className="text-slate-300 text-lg">Loading your notes...</p>
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
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    My Notes
                  </h1>
                </div>
              </div>
              {planInfo && (
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r ${getPlanColor(planInfo.plan)} text-white`}>
                    {getPlanIcon(planInfo.plan)}
                    {planInfo.plan} Plan
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <FileText className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-300 text-sm font-medium">
                      {planInfo.current}/{planInfo.limit} notes used
                      {planInfo.plan === 'Free' && (
                        <span className="ml-2 text-indigo-300">
                          ({planInfo.remaining} remaining)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                disabled={planInfo?.plan === 'Free' && planInfo?.current >= 3}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                  planInfo?.plan === 'Free' && planInfo?.current >= 3
                    ? 'bg-slate-600/30 text-slate-500 cursor-not-allowed border-slate-600/30'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-emerald-400/50 hover:shadow-xl'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {showCreateForm ? 'Cancel' : 'Create Note'}
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
                  <p className="text-slate-400 text-sm font-medium">Total Notes</p>
                  <p className="text-3xl font-bold text-white mt-1">{notes.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Recent Activity</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {notes.length > 0 ? 'Active' : 'No notes'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Usage</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {planInfo?.plan === 'Free' ? `${Math.round((planInfo.current / 3) * 100)}%` : 'Unlimited'}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(planInfo?.plan || 'Free')} rounded-xl flex items-center justify-center`}>
                  {getPlanIcon(planInfo?.plan || 'Free')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Create Note Form */}
          {showCreateForm && (
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8 animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Note</h2>
              </div>
              <form onSubmit={createNote} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Note Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Enter a descriptive title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                    rows={6}
                    placeholder="Write your note content here..."
                    required
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="group relative px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Create Note
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer text-white"
                  >
                    <span className="flex items-center gap-2">
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
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="newest" className="bg-slate-800">Newest First</option>
                  <option value="oldest" className="bg-slate-800">Oldest First</option>
                  <option value="title" className="bg-slate-800">By Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6" />
                All Notes ({filteredAndSortedNotes.length})
              </h2>
            </div>
            
            {filteredAndSortedNotes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">No notes found</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Create your first note to get started'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    disabled={planInfo?.plan === 'Free' && planInfo?.current >= 3}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      planInfo?.plan === 'Free' && planInfo?.current >= 3
                        ? 'bg-slate-600/30 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white hover:shadow-xl'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Note
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 space-y-6">
                {filteredAndSortedNotes.map((note, index) => (
                  <div 
                    key={note._id} 
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {editingNote && editingNote._id === note._id ? (
                      // Edit form
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Edit3 className="w-5 h-5 text-indigo-400" />
                          <h4 className="text-lg font-bold text-white">Edit Note</h4>
                        </div>
                        <form onSubmit={updateNote} className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">Content</label>
                            <textarea
                              value={editForm.content}
                              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                              rows={6}
                              required
                            />
                          </div>
                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
                            >
                              <span className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Changes
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer text-white"
                            >
                              <span className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                Cancel
                              </span>
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      // Note display
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                              {note.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(note.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {typeof note.createdBy === 'object' 
                                  ? (note.createdBy._id === currentUser?.id ? 'You' : note.createdBy.name)
                                  : (note.createdBy === currentUser?.id ? 'You' : 'Other user')
                                }
                              </div>
                            </div>
                          </div>
                          {(typeof note.createdBy === 'object' 
                            ? note.createdBy._id === currentUser?.id 
                            : note.createdBy === currentUser?.id
                          ) && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(note)}
                                className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 backdrop-blur-sm rounded-lg border border-indigo-400/30 hover:border-indigo-400/50 transition-all cursor-pointer text-indigo-300"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteNote(note._id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all cursor-pointer text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

export default NotesPage;