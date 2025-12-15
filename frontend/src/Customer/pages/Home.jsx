import { Link } from "react-router-dom";
import { Utensils, Clock, Award, Star, Quote } from "lucide-react";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Seerat Restaurant</h1>
        <h3>Where Delicious food is delivered to your doorstep</h3>
        <Link to="/menu" className="btn">
          Order Now
        </Link>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-3xl font-bold mb-2 text-gray-800">Why Choose Us?</h2>
          <p className="text-gray-500 mb-10">We serve not just food, but an experience.</p>

          <div className="features-grid">
            <div className="feature-box">
              <Utensils className="feature-icon" />
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We source locally to ensure every dish is fresh and healthy.</p>
            </div>

            <div className="feature-box">
              <Clock className="feature-icon" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot food delivered to your doorstep in record time.</p>
            </div>

            <div className="feature-box">
              <Award className="feature-icon" />
              <h3 className="text-xl font-semibold mb-2">Best Chefs</h3>
              <p className="text-gray-600">Cooked by renowned chefs with years of experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title text-3xl font-bold mb-2 text-gray-800">What Customers Say</h2>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <Quote className="quote-icon" />
              <p className="text-gray-600 italic">"The chicken burger was absolutely divine! Best in town hands down."</p>
              <div className="customer-info">
                <div className="avatar bg-gray-300 flex items-center justify-center text-xl font-bold text-white">A</div>
                <div>
                  <h4 className="font-bold">Ahmed Khan</h4>
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <Quote className="quote-icon" />
              <p className="text-gray-600 italic">"Super fast delivery and the packaging was excellent. Highly recommended!"</p>
              <div className="customer-info">
                <div className="avatar bg-gray-300 flex items-center justify-center text-xl font-bold text-white">S</div>
                <div>
                  <h4 className="font-bold">Sara Ali</h4>
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <Quote className="quote-icon" />
              <p className="text-gray-600 italic">"Ordering for the family was so easy. The deals are great value for money."</p>
              <div className="customer-info">
                <div className="avatar bg-gray-300 flex items-center justify-center text-xl font-bold text-white">B</div>
                <div>
                  <h4 className="font-bold">Bilal Ahmed</h4>
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[hsl(var(--primary))] text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Hungry?</h2>
        <p className="text-xl mb-8">Order now and get 20% off your first meal!</p>
        <Link to="/menu" className="bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
          See the Menu
        </Link>
      </section>
    </>
  );
}

export default Home;