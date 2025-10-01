import "./HeroSection.css";
import hero from "../../../../public/assets/hero.png";
import NavBar from "../../../pages/Shared/NavBar/NavBar";
const HeroSection = () => {
  return (
    <div>
      <div className="header">
        <div className="navsBarWrap">
        <NavBar/>
        
          <div className="header-content">
            <div className="right-side">
              <img src={hero} alt="hero" />
            </div>
            <div className="left-side">
              <h1 className="welcome-heading">Welcome to SoftyPy !</h1>
              <p className="welcome-paragraph">
                Accelerate Your Business Growth With Our Proven Digital
                Marketing Strategies <br />
                We help businesses of all sizes maximize their online presence
                and reach their target audience with our data-driven approach to
                digital marketing.
              </p>
              <button className="ExploreBtn"> Explore Us </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
