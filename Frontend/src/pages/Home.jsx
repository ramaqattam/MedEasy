import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctos";
import Banner from "../components/Banner";
import ScrollToTop from "../components/ScrollToTop";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <main className="flex-grow">
        {/* Progressive loading sections with animations */}
        <section className="mb-8 px-4 md:px-8 lg:px-16 xl:px-20">
          <Header />
        </section>
        
        <section className="mb-8 px-4 md:px-8 lg:px-16 xl:px-20">
          <SpecialityMenu />
        </section>
        
        <section className="mb-8 px-4 md:px-8 lg:px-16 xl:px-20">
          <TopDoctors />
        </section>
        
        <section className="mb-8 px-4 md:px-8 lg:px-16 xl:px-20">
          <Banner isAuthenticated={isAuthenticated} />
        </section>
      </main>
      
      <ScrollToTop />
    </div>
  );
};

export default Home;