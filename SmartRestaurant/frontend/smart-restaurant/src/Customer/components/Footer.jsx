import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="footer-section">
            <div className="container footer-content">
                <div className="footer-col">
                    <h3>Seerat Restaurant</h3>
                    <p>Experience the authentic taste of tradition mixed with modern culinary art. Delivered fresh to your door.</p>
                    <div className="social-links">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/menu">Our Menu</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/rider">Rider App</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Contact Us</h4>
                    <ul className="contact-list">
                        <li><MapPin size={16} /> 123 Food Street, Lahore</li>
                        <li><Phone size={16} /> +92 300 1234567</li>
                        <li><Mail size={16} /> info@seerat.com</li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Newsletter</h4>
                    <p>Subscribe to get special offers.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Enter your email" />
                        <button>Go</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Seerat Restaurant. All rights reserved.</p>
            </div>
        </footer>
    );
}
