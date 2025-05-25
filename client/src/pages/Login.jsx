import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
// No direct import for react-router-dom's useNavigate, using onNavigate prop instead

// --- Shadcn/ui-inspired Component Definitions (Simplified for single-file use) ---

// Button Component
const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50 hover:text-indigo-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-indigo-600 underline-offset-4 hover:underline hover:text-indigo-800",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
      {...props}
    />
  );
};

// Label Component
const Label = ({ className, children, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Card Components (Adjusted for a softer, more modern look)
const Card = ({ className, children, ...props }) => (
  <div className={`rounded-3xl bg-white text-gray-900 shadow-2xl overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);
const CardHeader = ({ className, children, ...props }) => (
  <div className={`flex flex-col space-y-2 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-t-3xl ${className}`} {...props}>
    {children}
  </div>
);
const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-3xl font-extrabold leading-tight tracking-tight text-center ${className}`} {...props}>
    {children}
  </h3>
);
const CardDescription = ({ className, children, ...props }) => (
  <p className={`text-base text-indigo-100 text-center mt-2 ${className}`} {...props}>
    {children}
  </p>
);
const CardContent = ({ className, children, ...props }) => (
  <div className={`p-8 pt-6 ${className}`} {...props}>
    {children}
  </div>
);
const CardFooter = ({ className, children, ...props }) => (
  <div className={`flex items-center justify-center p-6 pt-0 bg-gray-50 rounded-b-3xl ${className}`} {...props}>
    {children}
  </div>
);

// Lucide React Icons (Simplified - using inline SVG for demonstration)
const Mail = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Lock = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// --- Custom Toast System (Simplified for single-file use) ---
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "default") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000); // Auto-dismiss after 3 seconds
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toaster display area */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-xl text-white font-semibold flex items-center gap-3 transition-all duration-300 ease-out transform translate-x-0 opacity-100 ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ animation: 'slideInRight 0.3s forwards' }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  return useContext(ToastContext);
};


// --- Main Login Component ---
const Login = ({ setAuth, onNavigate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const addToast = useToast(); // Use the custom toast hook

    // Hardcoded backend URL to avoid import.meta.env issues
    const API_BASE_URL = "https://argo-flask-backend.onrender.com";

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                console.log("🔹 Received Token:", data.token);
        
                // Using localStorage as per original code
                localStorage.setItem("token", data.token);
                console.log("Token Saved in localStorage:", localStorage.getItem("token"));
        
                setAuth(true); // Set authentication status
                addToast("Login successful! Redirecting...", "success");
        
                setTimeout(() => {
                    onNavigate("/"); // Use the prop for navigation
                }, 500);
            } else {
                addToast(data.message || "Login failed", "error");
            }
        } catch (error) {
            addToast("Something went wrong. Please try again.", "error");
        }
    };
    
    return (
      <ToastProvider> {/* Wrap the component with ToastProvider */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 font-sans relative overflow-hidden">
          {/* Abstract shapes for background */}
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <Card className="w-full max-w-md z-10 animate-fade-in-up">
            <CardHeader>
              <CardTitle>
                Welcome Back!
              </CardTitle>
              <CardDescription>
                Log in to continue your journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 pr-4"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-4"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full py-3 text-lg font-bold">
                  Login
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="font-bold text-indigo-600 hover:text-indigo-800"
                  onClick={() => onNavigate("signup")}
                >
                  Sign Up
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
        {/* Tailwind CSS keyframes for animations */}
        <style>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fade-in-up {
            animation: fadeInScale 0.6s ease-out forwards;
          }
        `}</style>
      </ToastProvider>
    );
};

export default Login;
