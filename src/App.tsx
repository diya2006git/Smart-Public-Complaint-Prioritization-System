import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  Link
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  LogOut, 
  Menu, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ShieldAlert,
  Users,
  BarChart3,
  MapPin,
  FileText,
  ChevronRight,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from './store/authStore';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

// --- Components ---

const Button = ({ children, className = '', variant = 'primary', ...props }: any) => {
  const variants: any = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: any) => {
  const variants: any = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[children] || variants[variant]}`}>
      {children}
    </span>
  );
};

// --- Pages ---

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-600 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-blue-900">AI SmartGov</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#problem" className="hover:text-blue-600 transition-colors">Problem</a>
          <a href="#solution" className="hover:text-blue-600 transition-colors">Solution</a>
          <a href="#ai-features" className="hover:text-blue-600 transition-colors">AI Features</a>
          <Link to="/login"><Button variant="primary">Login</Button></Link>
        </div>
      </nav>

      <section id="home" className="pt-24 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" /> Powered by Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 mb-6 leading-tight">
            AI Smart Complaint <br />
            <span className="text-blue-600">Prioritization System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            "AI-Driven Complaint Management for Faster Public Service." Automatically classify, prioritize, and route complaints using advanced machine learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login"><Button className="w-full sm:w-auto px-8 py-4 text-lg">Get Started</Button></Link>
            <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg">Learn More</Button>
          </div>
        </motion.div>
      </section>

      <section id="problem" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">The Problem Statement</h2>
            <p className="text-lg text-gray-600 mb-8">
              Government complaint systems are slow because complaints are manually sorted. This leads to critical delays and inefficient resource management.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'No Prioritization', icon: AlertCircle },
                { title: 'Wrong Assignment', icon: X },
                { title: 'Delayed Response', icon: Clock },
                { title: 'No Data Insights', icon: BarChart3 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <item.icon className="text-red-500 w-5 h-5" />
                  <span className="font-medium text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
            <Card className="relative z-10 p-8 border-2 border-red-50">
              <div className="text-red-600 font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Manual Bottleneck
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-400">Processing time: <span className="text-red-500 font-bold">48-72 Hours</span></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="solution" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">The Intelligent Solution</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our system uses AI to automatically analyze complaints, ensuring faster resolution and smart classification.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { title: 'Faster Resolution', icon: Zap, color: 'text-yellow-500' },
            { title: 'Smart Classification', icon: Brain, color: 'text-blue-500' },
            { title: 'Auto Priority', icon: Target, color: 'text-red-500' },
            { title: 'Better Admin', icon: ShieldAlert, color: 'text-emerald-500' },
          ].map((item, i) => (
            <Card key={i} className="text-center hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section id="ai-features" className="py-24 bg-blue-900 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core AI Features</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">Real-time intelligence powering every interaction.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Classification', desc: 'Detects category: Water, Electric, Road, etc.', icon: ListTodo },
              { title: 'Priority Prediction', desc: 'Urgency detection based on semantic analysis.', icon: Activity },
              { title: 'Dept. Assignment', desc: 'Automatic routing to the correct department.', icon: Users },
              { title: 'Insights Dashboard', desc: 'Predictive analytics and trend visualization.', icon: TrendingUp },
              { title: 'Summary Generator', desc: 'Concise summaries of complex complaints.', icon: FileText },
              { title: 'Real-time Processing', desc: 'Instant feedback for citizens after submission.', icon: Zap },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              >
                <item.icon className="w-10 h-10 mb-4 text-blue-300" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-12 border-t border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600 w-6 h-6" />
            <span className="text-lg font-bold text-blue-900">AI SmartGov</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 AI SmartGov Systems. Built for Hackathons & Academic Evaluation.</p>
        </div>
      </footer>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('/api/auth/login', { email, password, role });
      setSuccess(res.data.message || 'Login Successful');
      setAuth(res.data.user, res.data.token);
      setTimeout(() => {
        navigate(`/${role.toLowerCase()}/dashboard`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Link to="/" className="text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-2 text-sm">
          <ChevronRight className="rotate-180 w-4 h-4" /> Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Login</h2>
        <p className="text-gray-500 mb-8 text-sm">Access the AI SmartGov portal</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}
        {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-6 border border-emerald-100">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={role} onChange={e => setRole(e.target.value)}>
              <option value="Citizen">Citizen</option>
              <option value="Officer">Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button disabled={loading} className="w-full py-3 mt-4">{loading ? 'Logging in...' : 'Login'}</Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
        </div>
      </Card>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Citizen' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Link to="/login" className="text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-2 text-sm">
          <ChevronRight className="rotate-180 w-4 h-4" /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Register</h2>
        <p className="text-gray-500 mb-8 text-sm">Join the AI SmartGov platform</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="Citizen">Citizen</option>
              <option value="Officer">Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button disabled={loading} className="w-full py-3 mt-4">{loading ? 'Registering...' : 'Register'}</Button>
        </form>
      </Card>
    </div>
  );
};

// --- Dashboard Layout ---

const DashboardLayout = ({ children, activeTab, setActiveTab }: any) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs: any = {
    Citizen: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'submit', label: 'Submit Complaint', icon: PlusCircle },
      { id: 'my-complaints', label: 'My Complaints', icon: ListTodo },
    ],
    Officer: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'complaints', label: 'Complaints', icon: AlertCircle },
      { id: 'my-actions', label: 'My Actions', icon: CheckCircle2 },
    ],
    Admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'all-complaints', label: 'All Complaints', icon: ListTodo },
      { id: 'officers', label: 'Officers', icon: Users },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-blue-900 text-white min-h-screen flex flex-col p-6 fixed left-0 top-0">
        <div className="flex items-center gap-2 mb-12">
          <Brain className="text-blue-300 w-8 h-8" />
          <span className="text-xl font-bold">AI SmartGov</span>
        </div>
        <nav className="flex-1 space-y-2">
          {tabs[user.role].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Welcome back</h1>
            <div className="text-2xl font-bold text-gray-900">{user.name} <span className="text-gray-400 font-normal">({user.role})</span></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{user.name[0]}</div>
        </header>
        {children}
      </main>
    </div>
  );
};

// --- Portal Views ---

const CitizenPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>({});
  const [complaints, setComplaints] = useState([]);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore(state => state.token);

  const fetchData = async () => {
    try {
      const [s, c] = await Promise.all([
        axios.get('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/complaints', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(s.data);
      setComplaints(c.data);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-600">
            <div className="text-sm text-gray-500 mb-1">Total Submitted</div>
            <div className="text-3xl font-bold">{stats.total?.count || 0}</div>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold">{stats.pending?.count || 0}</div>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <div className="text-sm text-gray-500 mb-1">Resolved</div>
            <div className="text-3xl font-bold">{stats.resolved?.count || 0}</div>
          </Card>
        </div>
      )}
      {activeTab === 'submit' && (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-bold mb-6">Submit Complaint</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const form = e.target as any;
              try {
                const res = await axios.post('/api/complaints', {
                  title: form.title.value,
                  description: form.description.value,
                  location: form.location.value
                }, { headers: { Authorization: `Bearer ${token}` } });
                setAiResult(res.data);
                form.reset();
              } catch (err) {
                alert('Submission failed');
              } finally {
                setLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input name="title" required placeholder="Short summary" className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" required placeholder="Detailed description..." className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input name="location" required placeholder="Area or Landmark" className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <Button disabled={loading} className="w-full py-3">
                {loading ? 'AI Analyzing...' : 'Submit & Analyze'}
              </Button>
            </form>
          </Card>

          <AnimatePresence>
            {aiResult && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-2 border-blue-100 bg-blue-50/30">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-6">
                    <Brain className="w-5 h-5" /> AI Analysis Result
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Category</div>
                        <div className="font-bold text-gray-900">{aiResult.category}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Priority</div>
                        <Badge>{aiResult.priority}</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-1">Assigned Department</div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> {aiResult.department}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-1">AI Summary</div>
                      <div className="text-gray-700 italic">"{aiResult.summary}"</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab('my-complaints')}>
                      View in My Complaints
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {activeTab === 'my-complaints' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="p-4">ID</th><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Priority</th><th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c: any) => (
                <tr key={c._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-400">#{c._id.slice(-6)}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{c.summary}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{c.category}</td>
                  <td className="p-4"><Badge>{c.priority}</Badge></td>
                  <td className="p-4"><Badge variant={c.status}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && <div className="p-10 text-center text-gray-400">No complaints found.</div>}
        </Card>
      )}
    </DashboardLayout>
  );
};

const OfficerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>({});
  const [complaints, setComplaints] = useState([]);
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  const fetchData = async () => {
    try {
      const [s, c] = await Promise.all([
        axios.get('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/complaints', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(s.data);
      setComplaints(c.data);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-600"><div className="text-sm text-gray-500">Total</div><div className="text-3xl font-bold">{stats.total?.count || 0}</div></Card>
          <Card className="border-l-4 border-l-red-500"><div className="text-sm text-gray-500">High</div><div className="text-3xl font-bold">{stats.high?.count || 0}</div></Card>
          <Card className="border-l-4 border-l-yellow-500"><div className="text-sm text-gray-500">Medium</div><div className="text-3xl font-bold">{stats.medium?.count || 0}</div></Card>
          <Card className="border-l-4 border-l-green-500"><div className="text-sm text-gray-500">Low</div><div className="text-3xl font-bold">{stats.low?.count || 0}</div></Card>
        </div>
      )}
      {activeTab === 'complaints' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500"><th className="p-4">ID</th><th className="p-4">Complaint</th><th className="p-4">Priority</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody>
              {complaints.map((c: any) => (
                <tr key={c._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-400">#{c._id.slice(-6)}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.category} • {c.location}</div>
                  </td>
                  <td className="p-4"><Badge>{c.priority}</Badge></td>
                  <td className="p-4"><Badge variant={c.status}>{c.status}</Badge></td>
                  <td className="p-4">
                    <select className="border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={c.status} onChange={async (e) => {
                      await axios.patch(`/api/complaints/${c._id}/status`, { status: e.target.value }, { headers: { Authorization: `Bearer ${token}` } });
                      fetchData();
                    }}>
                      <option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {activeTab === 'my-actions' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50"><tr className="text-sm text-gray-500"><th className="p-4">ID</th><th className="p-4">Title</th><th className="p-4">Priority</th><th className="p-4">Status</th></tr></thead>
            <tbody>
              {complaints.filter((c: any) => c.officer_id === user?.id).map((c: any) => (
                <tr key={c._id} className="border-t">
                  <td className="p-4 text-xs font-mono">#{c._id.slice(-6)}</td>
                  <td className="p-4 font-medium">{c.title}</td>
                  <td className="p-4"><Badge>{c.priority}</Badge></td>
                  <td className="p-4"><Badge variant={c.status}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </DashboardLayout>
  );
};

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>({});
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const token = useAuthStore(state => state.token);

  const fetchData = async () => {
    try {
      const [s, c, o] = await Promise.all([
        axios.get('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/complaints', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/officers', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(s.data);
      setComplaints(c.data);
      setOfficers(o.data);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-blue-600 text-white shadow-blue-200 shadow-lg"><div className="opacity-80 text-sm font-bold uppercase tracking-wider">Total</div><div className="text-3xl font-bold">{stats.total?.count || 0}</div></Card>
            <Card className="bg-red-600 text-white shadow-red-200 shadow-lg"><div className="opacity-80 text-sm font-bold uppercase tracking-wider">High Priority</div><div className="text-3xl font-bold">{stats.high?.count || 0}</div></Card>
            <Card className="bg-emerald-600 text-white shadow-emerald-200 shadow-lg"><div className="opacity-80 text-sm font-bold uppercase tracking-wider">Resolved</div><div className="text-3xl font-bold">{stats.resolved?.count || 0}</div></Card>
            <Card className="bg-yellow-500 text-white shadow-yellow-200 shadow-lg"><div className="opacity-80 text-sm font-bold uppercase tracking-wider">Pending</div><div className="text-3xl font-bold">{stats.pending?.count || 0}</div></Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" /> Complaints by Category
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categories?.map((cat: any) => ({ name: cat._id, count: cat.count }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Monthly Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.trends?.map((t: any) => ({ name: `Month ${t._id}`, count: t.count }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
      {activeTab === 'all-complaints' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50"><tr className="text-sm text-gray-500"><th className="p-4">ID</th><th className="p-4">Citizen</th><th className="p-4">Complaint</th><th className="p-4">Priority</th><th className="p-4">Officer</th></tr></thead>
            <tbody>
              {complaints.map((c: any) => (
                <tr key={c._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-400">#{c._id.slice(-6)}</td>
                  <td className="p-4 text-sm">{c.citizen_id?.name}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.category} • {c.department}</div>
                  </td>
                  <td className="p-4"><Badge>{c.priority}</Badge></td>
                  <td className="p-4">
                    <select className="border rounded p-1 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500" value={c.officer_id?._id || ''} onChange={async (e) => {
                      await axios.patch(`/api/complaints/${c._id}/assign`, { officer_id: e.target.value }, { headers: { Authorization: `Bearer ${token}` } });
                      fetchData();
                    }}>
                      <option value="">Unassigned</option>
                      {officers.map((o: any) => <option key={o._id} value={o._id}>{o.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {activeTab === 'officers' && (
        <div className="grid md:grid-cols-3 gap-6">
          {officers.map((o: any) => (
            <Card key={o._id} className="flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">{o.name[0]}</div>
              <div><div className="font-bold text-gray-900">{o.name}</div><div className="text-xs text-gray-500">Officer ID: {o._id.slice(-6)}</div></div>
            </Card>
          ))}
        </div>
      )}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-blue-900">AI Insights Report</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="font-bold mb-4">Priority Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High', value: stats.high?.count || 0 },
                        { name: 'Medium', value: stats.medium?.count || 0 },
                        { name: 'Low', value: stats.low?.count || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="flex flex-col justify-center text-center">
              <div className="text-blue-600 font-bold text-4xl mb-2">
                {Math.round(((stats.resolved?.count || 0) / (stats.total?.count || 1)) * 100)}%
              </div>
              <div className="text-gray-500 font-medium">Resolution Efficiency</div>
              <p className="text-sm text-gray-400 mt-4">AI-driven prioritization has improved response times by an estimated 40%.</p>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/citizen/dashboard" element={<CitizenPortal />} />
        <Route path="/officer/dashboard" element={<OfficerPortal />} />
        <Route path="/admin/dashboard" element={<AdminPortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
