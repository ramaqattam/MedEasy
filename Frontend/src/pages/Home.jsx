import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctos";
import Banner from "../components/Banner";
import ScrollToTop from "../components/ScrollToTop";
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <main className="flex-grow">
        {/* Progressive loading sections with animations */}
        <section className="mb-8">
          <Header />
        </section>
        
        <section className="mb-8">
          <SpecialityMenu />
        </section>
        
        <section className="mb-8">
          <TopDoctors />
        </section>
        
        <section className="mb-8">
          <Banner />
        </section>

        
        
      </main>
      
      <ScrollToTop />
    </div>
  );
};

export default Home;
