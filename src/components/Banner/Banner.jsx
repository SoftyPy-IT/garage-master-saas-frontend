import CommonButton from "../../pages/Shared/CommonButton/CommonButton";
import "./Banner.css";
const Banner = () => {
  return (
    <div className="banner">
      <div className="bannerContent">
        <div>
          <h2>
            Accelerate Your Business Growth With Our Proven Digital Marketing
            Strategies
          </h2>
          <p>
            {" "}
            We help businesses of all sizes maximize their online presence and
            reach their target audience with our data-driven approach to digital
            marketing.
          </p>
          <div className="buttonWrap">
            <CommonButton text="Explore Our Services"></CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
