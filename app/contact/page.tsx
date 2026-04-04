import ContactRoute from "./components/Comp1";
import Navbar from "@/app/components/Navbar";

export default function ContactPage() {
  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <Navbar />
      <ContactRoute />
    </div>
  );
}