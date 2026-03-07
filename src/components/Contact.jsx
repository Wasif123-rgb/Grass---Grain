import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2>Contact Grass & Grain</h2>
        <form>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message" rows="4"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}