import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@radix-ui/react-collapsible";

import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

import heroImage from "../assets/farm_2.jpeg";

const testimonials = [
  {
    name: "John Doe",
    feedback:
      "This Agriculture Assistant app changed how I farm. The crop prediction feature is a game-changer!",
  },
  {
    name: "Sita Sharma",
    feedback:
      "Market prices tracking helped me decide the best time to sell my produce. Highly recommend!",
  },
  {
    name: "Rahul Singh",
    feedback:
      "The community forum connects me with expert farmers. Great platform overall.",
  },
];

const faqs = [
  {
    question: "How accurate is the crop prediction?",
    answer:
      "Our AI models are trained on historical data and local weather patterns, providing highly accurate predictions.",
  },
  {
    question: "Can I sell my produce directly through the marketplace?",
    answer:
      "Yes! Our marketplace allows secure buying and selling among farmers and buyers.",
  },
  {
    question: "How often is market price data updated?",
    answer:
      "Market prices are updated every hour to ensure you get the latest information.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  useEffect(() => {
    const fetchToken = () => {
      const token = localStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchToken();
    window.addEventListener("storage", fetchToken);
    return () => window.removeEventListener("storage", fetchToken);
  }, []);

  const handlePredictClick = () => {
    if (isAuthenticated) {
      navigate("/predict");
    } else {
      navigate("/login");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus("Please enter a valid email.");
      return;
    }
    setNewsletterStatus("Subscribed successfully! Thank you.");
    setNewsletterEmail("");
    // TODO: connect with backend API for real subscription
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <header className="relative rounded-lg overflow-hidden shadow-lg mb-16">
        <img
          src={heroImage}
          alt="Farm"
          className="w-full h-96 object-cover brightness-90"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start bg-black bg-opacity-40 px-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Agriculture Assistant
          </h1>
          <p className="text-lg text-white mb-6 drop-shadow-lg max-w-xl">
            AI-powered solutions to enhance farming and crop prediction.
          </p>
          <button
            onClick={handlePredictClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition"
          >
            Predict Your Crop
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-green-600 mb-10">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">🌱 Crop Prediction</h3>
            <p>Get AI-based recommendations for the best crops to grow.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">📊 Market Prices</h3>
            <p>Track live crop prices to make better selling decisions.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">🛒 Marketplace</h3>
            <p>Buy and sell agricultural products with ease.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">👥 Community Forum</h3>
            <p>Connect with fellow farmers and share knowledge.</p>
          </div>
          {/* New features */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">☀️ Weather Forecast</h3>
            <p>Get daily weather updates for your farming region.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">🌾 Soil Health Tips</h3>
            <p>Personalized soil health and nutrition recommendations.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">🧑‍🌾 Expert Advice</h3>
            <p>Ask agricultural experts your farming questions directly.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">📈 Farming Analytics</h3>
            <p>Analyze your farm’s performance with AI-driven analytics.</p>
          </div>
        </div>
      </section>

      {/* Weather Forecast Widget */}
      <section className="mb-20 bg-green-50 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-green-600 mb-6">Weather Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example day cards */}
          {["Mon", "Tue", "Wed"].map((day) => (
            <div
              key={day}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <h3 className="text-lg font-semibold mb-2">{day}</h3>
              <p className="text-4xl mb-1">☀️</p>
              <p>High: 30°C</p>
              <p>Low: 20°C</p>
              <p>Humidity: 60%</p>
            </div>
          ))}
        </div>
      </section>

      {/* Soil Health Tips */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-green-600 mb-6">Soil Health Tips</h2>
        <ul className="list-disc list-inside space-y-3 max-w-4xl mx-auto text-lg text-gray-700">
          <li>Regularly test soil pH to maintain nutrient balance.</li>
          <li>Use organic compost to improve soil texture and fertility.</li>
          <li>Rotate crops annually to prevent soil depletion.</li>
          <li>Implement cover crops to protect soil during off-season.</li>
          <li>Manage irrigation to avoid waterlogging and soil erosion.</li>
        </ul>
      </section>

      {/* Testimonials Slider */}
      <section className="mb-20 bg-green-50 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-10 text-center">
          What Farmers Say
        </h2>
        <div className="space-y-8">
          {testimonials.map(({ name, feedback }, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">"{feedback}"</p>
              <p className="font-semibold text-green-700 text-right">- {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }, i) => (
            <Collapsible key={i} defaultOpen={false}>
              <CollapsibleTrigger className="w-full text-left font-semibold py-3 px-4 bg-green-400 rounded-lg hover:bg-green-200 cursor-pointer">
                {question}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 bg-green-50 rounded-b-lg text-gray-700">
                {answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="mb-20 bg-green-100 p-8 rounded-lg shadow-md max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Stay Updated</h2>
        <p className="mb-6 text-gray-700">
          Subscribe to our newsletter for the latest farming updates.
        </p>
        <form
          onSubmit={handleNewsletterSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="max-w-sm"
            required
          />
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Subscribe
          </Button>
        </form>
        {newsletterStatus && (
          <p
            className={`mt-4 ${
              newsletterStatus.includes("success")
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {newsletterStatus}
          </p>
        )}
      </section>

      {/* Contact Form */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-10 text-center">Contact Us</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for reaching out! We'll get back to you soon.");
            // Add real backend submission here
          }}
          className="space-y-6 bg-white p-8 rounded-lg shadow-md"
        >
          <Input type="text" placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <Textarea placeholder="Your Message" rows={5} required />
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Send Message
          </Button>
        </form>
      </section>

      {/* Call to Action */}
      <section className="mb-20 bg-green-600 text-white text-center py-12 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">
          Ready to take your farming to the next level?
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Download our mobile app or create your free account today and start
          predicting your best crops!
        </p>
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => navigate("/signup")}
            className="bg-white text-green-700 hover:bg-gray-100"
          >
            Sign Up Now
          </Button>
          <Button
            onClick={() => window.open("https://appstore.com/agricultureassistant", "_blank")}
            className="bg-white text-green-700 hover:bg-gray-100"
          >
            Download App
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <p className="mb-4 md:mb-0">
            &copy; 2025 Agriculture Assistant. All rights reserved.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-white"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:support@agricultureassistant.com"
              aria-label="Email"
              className="hover:text-white"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
