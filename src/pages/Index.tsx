import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReasonsSection from "@/components/ReasonsSection";
import PhotoGallery from "@/components/PhotoGallery";
import ProposalSection from "@/components/ProposalSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16"> {/* Add padding top for fixed header */}
        <Hero />
        <ReasonsSection />
        <PhotoGallery />
        <ProposalSection />
      </div>
    </div>
  );
};

export default Index;
