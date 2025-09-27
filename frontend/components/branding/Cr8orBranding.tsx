import React from "react";

// Primary Brand Logo Component
const PrimaryBrandLogo = ({ width = 200, height = 80, className = "" }) => {
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      style={{ width, height }}
    >
      <div className="relative" style={{ width: height, height: height }}>
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
              <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
            </linearGradient>
          </defs>
          <path
            className="animate-pulse"
            d="M20 40 C20 25, 35 25, 40 40 C45 55, 60 55, 60 40 C60 25, 45 25, 40 40 C35 55, 20 55, 20 40 Z"
            stroke="url(#purpleGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))",
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          />
        </svg>

        {/* Blockchain Nodes */}
        <div className="absolute inset-0">
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              top: "20%",
              left: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.2s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              top: "20%",
              right: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.4s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              bottom: "20%",
              left: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.6s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              bottom: "20%",
              right: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.8s",
            }}
          />
        </div>

        {/* Creative Brush */}
        <div
          className="absolute w-5 h-5 rounded-full opacity-70 animate-bounce"
          style={{
            top: "-10px",
            right: "-10px",
            background: "linear-gradient(45deg, #f59e0b, #ef4444)",
            borderRadius: "50% 0",
            transform: "rotate(45deg)",
          }}
        />
      </div>

      <div
        className="font-black flex items-center text-4xl tracking-tight"
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
        }}
      >
        <span>NOVA</span>
        <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-gray-300 via-gray-700 bg-clip-text text-transparent transform -rotate-12 inline-block relative">
          M
        </span>
        <span>INT</span>
      </div>
    </div>
  );
};

// Icon Mark Component
const IconMark = ({ size = 100, className = "" }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
          </linearGradient>
        </defs>
        <path
          className="animate-pulse"
          d="M20 40 C20 25, 35 25, 40 40 C45 55, 60 55, 60 40 C60 25, 45 25, 40 40 C35 55, 20 55, 20 40 Z"
          stroke="url(#iconGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
        />
      </svg>

      {/* Blockchain Nodes */}
      <div className="absolute inset-0">
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            top: "20%",
            left: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.2s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            top: "20%",
            right: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.4s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            bottom: "20%",
            left: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.6s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            bottom: "20%",
            right: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.8s",
          }}
        />
      </div>

      {/* Creative Brush */}
      <div
        className="absolute w-5 h-5 rounded-full opacity-70 animate-bounce"
        style={{
          top: "-10px",
          right: "-10px",
          background: "linear-gradient(45deg, #f59e0b, #ef4444)",
          borderRadius: "50% 0",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
};

// Wordmark Component
const Wordmark = ({ size = 48, className = "" }) => {
  return (
    <span
      className={`font-black tracking-tight ${className}`}
      style={{
        fontSize: `${size}px`,
        background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
      }}
    >
      NOVA
      <span
        style={{
          fontSize: `${size + 11}px`,
        }}
        className=" font-black tracking-tight bg-gradient-to-r from-gray-300 via-gray-700 bg-clip-text text-transparent transform -rotate-12 inline-block relative"
      >
        M
      </span>
      INT
    </span>
  );
};

// Demo Component to showcase all logos
const NovaMintBranding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-orange-950 p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blockchain Network Visualization */}
        <div className="absolute inset-0 opacity-20">
          {/* Connection Lines */}
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.6 }} />
                <stop offset="50%" style={{ stopColor: "#06b6d4", stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: "#f97316", stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            {/* Network connections */}
            <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" opacity="0.3" className="animate-pulse" />
            <path d="M150,400 Q350,300 550,400 T950,400" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" opacity="0.3" className="animate-pulse animation-delay-1000" />
            <path d="M200,600 Q400,500 600,600 T1000,600" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" opacity="0.3" className="animate-pulse animation-delay-2000" />
          </svg>
        </div>
        
        {/* Floating NFT Cards */}
        <div className="absolute top-20 left-10 w-16 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg rotate-12 animate-float"></div>
        <div className="absolute top-40 right-16 w-14 h-18 bg-gradient-to-br from-orange-500/30 to-blue-500/30 rounded-lg -rotate-12 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-16 bg-gradient-to-br from-cyan-500/30 to-orange-500/30 rounded-lg rotate-6 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-18 h-22 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg -rotate-6 animate-float animation-delay-3000"></div>
        
        {/* Minting Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce animation-delay-3000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-orange-300 rounded-full animate-bounce animation-delay-4000"></div>
        
        {/* Digital Art Brush Strokes */}
        <div className="absolute top-32 right-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent -rotate-45 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/5 w-20 h-1 bg-gradient-to-r from-transparent via-orange-400/40 to-transparent rotate-12 animate-pulse animation-delay-2000"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            NovaMint Logo Components
          </h1>
          <p className="text-gray-300">
            Modern, Scalable React/Next.js Logo Components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Primary Brand Logo */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 hover:transform hover:-translate-y-2 hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-orange-500/20">
            <h3 className="text-blue-400 text-xl font-semibold mb-6 text-center">
              Primary Brand Logo
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <PrimaryBrandLogo width={280} height={80} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Full logo with icon and text
            </div>
          </div>

          {/* Icon Mark */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 hover:transform hover:-translate-y-2 hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-orange-500/20">
            <h3 className="text-blue-400 text-xl font-semibold mb-6 text-center">
              Icon Mark
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <IconMark size={100} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Standalone icon for favicons, avatars
            </div>
          </div>

          {/* Wordmark */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 hover:transform hover:-translate-y-2 hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-orange-500/20">
            <h3 className="text-blue-400 text-xl font-semibold mb-6 text-center">
              Wordmark
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <Wordmark size={48} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Text-only version for headers
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <h3 className="text-blue-400 text-2xl font-semibold mb-6 text-center">
            Usage Examples
          </h3>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="mb-2">
                  <IconMark size={32} />
                </div>
                <span className="text-xs text-gray-400">32px (Favicon)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <IconMark size={48} />
                </div>
                <span className="text-xs text-gray-400">48px (Avatar)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <Wordmark size={24} />
                </div>
                <span className="text-xs text-gray-400">24px (Nav)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <PrimaryBrandLogo width={200} height={60} />
                </div>
                <span className="text-xs text-gray-400">200px (Header)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Props */}
        <div className="mt-8 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <h3 className="text-blue-400 text-xl font-semibold mb-4">
            Component Props
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">
                PrimaryBrandLogo
              </h4>
              <ul className="text-gray-300 space-y-1">
                <li>• width: number (200)</li>
                <li>• height: number (80)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">IconMark</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• size: number (100)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Wordmark</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• size: number (48)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
          }
          100% {
            filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.9));
          }
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NovaMintBranding;

// Export individual components for use in other files
export { PrimaryBrandLogo, IconMark, Wordmark };
