import React from "react";
import HeroSection from "../components/HeroSection";
import WorkSection from "../components/WorkSection";
import About from "../components/About";
import FeatureSection from "../components/FeatureSection";
import CTASection from "../components/CTASection";


const Home = () => {
    return (
        <div className="text-gray-800">

            <HeroSection />

            <About />

            <FeatureSection />

            <CTASection />

            <WorkSection />

        </div>
    );
};

export default Home;
