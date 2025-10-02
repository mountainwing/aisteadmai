import Hero from "@/components/Hero";
import ReasonsSection from "@/components/ReasonsSection";
import PhotoGallery from "@/components/PhotoGallery";
import ProposalSection from "@/components/ProposalSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ReasonsSection />
      <PhotoGallery />
      <ProposalSection />
    </div>
  );
};

export default Index;
