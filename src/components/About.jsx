import "./About.css";
import Wasif from "./assets/Wasif.jpeg";
import Snigdha from "./assets/Snigdha.jpeg";
import Ifa from "./assets/Ifa.jpeg";

export default function About() {
  const cardStyle = {
    width: "980px",      
    minHeight: "750px",  
    padding: "60px",
    margin: "40px auto",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    textAlign: "center"
  };

  const imgStyle = {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "5px solid #2e7d32", 
    boxShadow: "0 0 25px rgba(46, 125, 50, 0.7)"
  };

  return (
    <div className="about-page">
      <div className="about-card" style={cardStyle}>
        <h2 className="title">About Us</h2>

        <p className="description">
          Welcome to our website! <strong>Grass & Grain</strong> 
          is our combined venture, a restaurant and sports initiative together. 
          We provide delicious meals and fun recreational activities for everyone in one place.
        </p>

        <h3 className="team-title">Our Team</h3>
        
        <div className="about-images">
          
          {/* Member: Wasif Ahmed */}
          <div className="member">
            <img src={Wasif} alt="Wasif Ahmed" style={imgStyle} />
            <p className="name">Wasif Ahmed</p>
            <p className="contact">Email: wasif123ahmed123@gmail.com</p>
            <p className="contact">
              GitHub: <a href="https://github.com/Wasif123-rgb" target="_blank" rel="noreferrer">Wasif123-rgb</a>
            </p>
          </div>

          {/* Member: Israt Hossain Snigdha */}
          <div className="member">
            <img src={Snigdha} alt="Israt Hossain Snigdha" style={imgStyle} />
            <p className="name">Israt Hossain Snigdha</p>
            <p className="contact">Email: israthossainsnigdha@gmail.com</p>
            <p className="contact">
              GitHub: <a href="https://github.com/IsratHossainSnigdha" target="_blank" rel="noreferrer">IsratHossainSnigdha</a>
            </p>
          </div>

          {/* Member: Ishrat Jahan Ifa */}
          <div className="member">
            <img src={Ifa} alt="Ishrat Jahan Ifa" style={imgStyle} />
            <p className="name">Ishrat Jahan Ifa</p>
            <p className="contact">Email: ishratifa2018@gmail.com</p>
            <p className="contact">
              GitHub: <a href="https://github.com/Ishrat-alt" target="_blank" rel="noreferrer">Ishrat-alt</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}