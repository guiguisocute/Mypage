import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import {
  Github,
  MapPin,
  Clock,
  Quote as QuoteIcon,
  Glasses,
  Heart,
  Terminal,
  ExternalLink,
  Atom,
  RectangleGoggles,

  Sun,
  Moon,
  Lock,
  X
} from 'lucide-react';
import avatarImage from './assets/avatar.png';

const ENCRYPTED_ADMIN_DATA = 'U2FsdGVkX18XxewTJs82TcpZlnzEZJAeuP40egBeC9h4pJnuYD4v4GQzEHEri5h3w+tFeFi0Xk1aXZwhSNRMTRQlTthua/Toxz18PWwcCvhXYgUSxxOB3UmlsC0AKHCRFkzrxx9xg7c1telnYHC7wBtXoW/mAHRogT53vrodFDkOfAeg/LY5bCa2y90bnPcF9RjvwigTS8X4qCLH5VDL5g==';

interface AdminLink {
  name: string;
  url: string;
}

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Admin Logic
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminLinks, setAdminLinks] = useState<AdminLink[]>([]);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (titleClickCount >= 5) {
      setShowLoginModal(true);
      setTitleClickCount(0);
    }
  }, [titleClickCount]);

  const handleTitleClick = () => {
    setTitleClickCount(prev => prev + 1);
  };

  const handleLogin = () => {
    try {
      // 使用 "用户名:密码" 组合作为解密密钥
      const credentials = `${username}:${password}`;
      const bytes = CryptoJS.AES.decrypt(ENCRYPTED_ADMIN_DATA, credentials);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalText) {
        throw new Error('Decryption failed');
      }

      const decryptedData = JSON.parse(originalText);

      if (Array.isArray(decryptedData)) {
        setAdminLinks(decryptedData);
        setLoginError(false);
      } else {
        throw new Error('Invalid data');
      }
    } catch (e) {
      setLoginError(true);
      setAdminLinks([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const closeAdmin = () => {
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
    setAdminLinks([]);
    setLoginError(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-700 relative overflow-hidden"
            >
              {adminLinks.length > 0 ? (
                // Admin Dashboard
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal size={20} className="text-slate-900 dark:text-white" />
                      管理员控制台
                    </h3>
                    <button onClick={closeAdmin} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {adminLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <span className="font-medium">{link.name}</span>
                        <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                // Login Form
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex items-center justify-center mb-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                      <Lock size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">管理员登录</h3>
                    <p className="text-sm text-slate-500 mt-2">请输入管理员凭据以继续</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">用户名</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="请输入用户名"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">密码</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="请输入密码"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm"
                      />
                    </div>
                    {loginError && (
                      <p className="text-red-500 text-xs text-center font-medium">❌ 登录失败，用户名或密码错误</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={closeAdmin}
                        className="flex-1 px-4 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleLogin}
                        className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm text-sm"
                      >
                        验证身份
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Glassmorphism Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-slate-800/50 shadow-sm py-4'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-xl tracking-tight text-slate-900 dark:text-white select-none cursor-pointer"
            onClick={handleTitleClick}
          >
            guiguisocute<span className="text-blue-600">.</span>
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <a href="https://blog.guiguisocute.cloud" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a>
              <a href="https://linux.do/u/guiguisocute/summary" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                LINUX DO <ExternalLink size={12} />
              </a>
              <a href="https://github.com/guiguisocute" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                Github <ExternalLink size={12} />
              </a>
            </motion.div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Avatar with Status */}
          <motion.div variants={fadeInUp} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-900/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
              <img src={avatarImage} alt="Guigui" className="w-full h-full object-cover" />
            </div>
            {/* Status Indicator */}
            <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-lg border border-slate-100 dark:border-slate-700 text-xl cursor-help" title="Slowly but surely">
              🐢
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
              你好！我是<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-black dark:from-slate-200 dark:to-white">可爱归归</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto">
              一个正在江西师范大学读大一的计算机专业的学生
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> NanChang, CN
            </div>
            <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <Clock size={16} /> UTC+08:00
            </div>
          </motion.div>

          {/* Quote Block */}
          <motion.div variants={fadeInUp} className="w-full max-w-2xl mt-12">
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <QuoteIcon className="absolute top-6 left-6 text-blue-100 dark:text-blue-900/30 w-8 h-8" />
              <p className="relative z-10 text-lg text-slate-600 dark:text-slate-300 italic font-serif leading-relaxed">
                "Open source community save my life."
              </p>
            </div>
          </motion.div>

        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 mt-32"
        >
          {/* About */}
          <section id="about" className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Heart size={20} /></div>
              <h2 className="text-2xl font-bold">关于我</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              你好！我是可爱归归，一个正在江西师范大学读大一的计算机专业的学生。<br></br>
              虽然现在还是很菜就是🥲<br></br>
            </p>
          </section>

          {/* Goals */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Terminal size={20} /></div>
              <h2 className="text-2xl font-bold">我的目标</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              我希望我能够对世界产生积极的影响。<br></br>
              无论是一个小脚本，帮助某人节省时间，还是对开源社区的更大贡献，我希望我的代码能够发挥作用。
            </p>
          </section>
        </motion.div>

        {/* Focus Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          id="learning"
          className="mt-24"
        >
          <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-8">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Glasses size={20} /></div>
            <h2 className="text-2xl font-bold">我目前在做</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Quest3开发",
                icon: <RectangleGoggles className="text-blue-500" />,
                desc: "开发VR游戏和应用。"
              },
              {
                title: "学术研究",
                icon: <Atom className="text-purple-500" />,
                desc: "研究3D高斯泼溅。"
              },
              {
                title: "贡献开源社区",
                icon: <Github className="text-slate-800 dark:text-slate-200" />,
                desc: "为开源社区贡献一份力。"
              },
            ].map((item, index) => (
              <div key={index} className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 w-fit rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-40 border-t border-slate-100 dark:border-slate-800 pt-10 pb-6 flex flex-col md:flex-row justify-between items-center text-slate-400 dark:text-slate-600 text-sm">
          <p>© 2026 guiguisocute. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="flex items-center gap-1 text-slate-300 dark:text-slate-700">
              Made with <Heart size={12} className="text-red-300 fill-current" />
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
