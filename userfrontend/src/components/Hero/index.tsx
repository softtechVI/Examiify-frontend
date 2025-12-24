import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const benefits = [
    "Streamlined Exam Management",
    "Real-time Analytics Dashboard",
    "Secure Result Processing",
    "Automated Grading System",
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Educational technology background"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-primary-light/90"></div> */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, hsla(173,80%,40%,0.9), hsla(160,84%,39%,0.8), hsla(173,65%,50%,0.9))",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-8">
            <span className="text-sm font-medium">
              🚀 Trusted by 500+ Educational Institutions
            </span>
          </div>

          {/* Main Headline */}
          {/* <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block text-transparent bg-gradient-to-r from-white via-accent-light to-white bg-clip-text">
              Exam Management
            </span>
          </h1> */}

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <h1 className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-transparent">
              {" "}
              Transform Your
            </h1>
            <span className="text-white block bg-gradient-to-r from-accent-light via-accent to-white bg-clip-text text-transparent">
              Exam Management
            </span>
          </h1>
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empower educators with cutting-edge technology to create, manage,
            and analyze exams with unprecedented efficiency and security.
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center sm:justify-start space-x-3 text-white"
              >
                <CheckCircle className="h-5 w-5 text-accent-light flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button className="btn-hero text-lg px-8 py-4 group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-outline-hero text-lg px-8 py-4 bg-white/10 border-white/30 hover:bg-white hover:text-primary"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                500+
              </div>
              <div className="text-white/80 font-medium">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                1M+
              </div>
              <div className="text-white/80 font-medium">Exams Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                98%
              </div>
              <div className="text-white/80 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;
