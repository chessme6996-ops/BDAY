import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Gift, PartyPopper, Music, Cake, Map as MapIcon, X, DollarSign, Heart, Shirt, CalendarDays, Utensils, Sparkles } from "lucide-react";
import Confetti from "@/components/Confetti";
import Countdown from "@/components/Countdown";
import CameraBackground from "@/components/CameraBackground";
import MouseParticles from "@/components/MouseParticles";


const BIRTHDAY_DATE = new Date("2026-04-15T18:00:00");
const YOUR_UPI_ID = "7880958890@ibl";
const YOUR_NAME = "Patty";
const GIFT_AMOUNT = "501"; 
const GIFT_NOTE = "Birthday Gift for Patty";
const MAP_URL = "https://maps.app.goo.gl/em7xYfV7xEigoa5B8";


const WHEN_IMAGE = "/my-birthday-photo.jpg";
const DRESS_CODE_IMAGE = "/dress-code.jpg";
const SURPRISE_VIDEO = "https://cdn.discordapp.com/attachments/1320696785022353482/1482650823040307341/Hamster_Rat_Doing_Backflip_and_Hysterically_Laughing_Meme_Template_by_514MMemes.mp4?ex=69b7b9ae&is=69b6682e&hm=a586c6cfc14e95987db26a2820ea6cebb71b3bab7072a1923f8abd720d2b9610&";

const EventDetail = ({ icon: Icon, title, text, onClick }: { icon: any; title: string; text: string; onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-4 bg-card rounded-[2rem] p-8 shadow-lg border border-primary/10 hover:shadow-2xl transition-all ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}
  >
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
    <p className="text-muted-foreground text-center text-base">{text}</p>
    {onClick && <span className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">Touch to view</span>}
  </motion.div>
);

const Index = () => {
  const [activeModal, setActiveModal] = useState<"when" | "map" | "dress" | "gift" | null>(null);
  const [showQr, setShowQr] = useState(false);

  const PAYMENT_URL = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${GIFT_AMOUNT}&cu=INR&tn=${encodeURIComponent(GIFT_NOTE)}&mode=02&purpose=00`;
  const paymentQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(PAYMENT_URL)}&margin=10&ecc=H`;

  const closeModal = () => {
    setActiveModal(null);
    setShowQr(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <CameraBackground />
      <MouseParticles />
      <Confetti />

      
      <section className="relative min-h-[45dvh] flex flex-col items-center justify-center px-4 pt-16 pb-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-4 px-2">
            Happy.. Birthdayyy<br />
            Pattyyyyy...... TEMM!!
          </h1>
        </motion.div>
      </section>

      
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8">MONIIII KA <span className="text-primary">BDAAYYYY</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EventDetail icon={Clock} title="When" text="April 15, 2026" onClick={() => setActiveModal("when")} />
            <EventDetail icon={MapPin} title="Where" text="CLICKK PLISS.." onClick={() => setActiveModal("map")} />
            <EventDetail icon={Gift} title="Dress Code" text="SUNDAR SMART !" onClick={() => setActiveModal("dress")} />
          </div>
        </div>
      </section>

      
      <section className="py-12 sm:py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">What I(Nannhii jan) <span className="text-secondary">WANT !!</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ icon: Shirt, title: "KAAPEEEEE...", desc: "SUNDAR SHIRT PANT PLIS GAREEB HU" }, { icon: Cake, title: "Delicious Cake", desc: "A stunning custom cake!" }, { icon: Utensils, title: "CHIIZZIII", desc: "KFC large bucket chicken" }].map((item, i) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"><item.icon className="text-primary w-10 h-10" /></div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div whileHover={{ scale: 1.02 }} onClick={() => setActiveModal("gift")} className="cursor-pointer bg-card rounded-[2.5rem] p-10 border-2 border-dashed border-primary/30 shadow-2xl relative overflow-hidden group">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
            <h2 className="font-display text-3xl font-bold mb-4">What I will gift to you</h2>
            <p className="text-muted-foreground mb-8">Tap to reveal a special surprise! 🎁</p>
            <div className="py-3 px-8 bg-primary text-primary-foreground rounded-full font-bold inline-block shadow-lg">Open Surprise</div>
          </motion.div>
        </div>
      </section>

      
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-card border border-primary/20 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white z-10"><X className="w-5 h-5" /></button>

              {activeModal === "when" && (
                <div className="flex flex-col"><img src={WHEN_IMAGE} className="h-80 w-full object-cover" /><div className="p-6 text-center"><h2>Save the Date!</h2><p>April 15, 2026</p></div></div>
              )}
              {activeModal === "map" && (
                <div className="p-8 text-center"><Heart className="w-8 h-8 mx-auto text-pink-500 mb-2 fill-current" /><h2>First CLICK!! then SCAN</h2><div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-lg border border-muted"><img src={paymentQrCode} className="w-40 h-40" /></div><a href={MAP_URL} target="_blank" className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-bold">Google Maps</a></div>
              )}
              {activeModal === "dress" && (
                <div className="flex flex-col"><img src={DRESS_CODE_IMAGE} className="h-80 w-full object-cover" /><div className="p-6 text-center"><h2>Dress Code</h2><p>SMARRT BOYYY..</p></div></div>
              )}

              {activeModal === "gift" && (
                <div className="flex flex-col">
                  <div className="h-64 w-full bg-black overflow-hidden relative">
                    <video 
                      id="surpriseVideo"
                      src={SURPRISE_VIDEO}
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="p-8 text-center">
                    {!showQr ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="font-display text-2xl font-bold mb-4">A Message for You! 🔊</h2>
                        <p className="text-muted-foreground text-sm mb-8 italic">"SUNKE AAGEE JANA!!!"</p>
                        <button 
                          onClick={() => {
                            const v = document.getElementById('surpriseVideo') as HTMLVideoElement;
                            if(v) v.pause();
                            setShowQr(true);
                          }}
                          className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                        >
                          <Gift className="w-5 h-5" /> Your Gift
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Heart className="w-8 h-8 mx-auto text-pink-500 mb-4 fill-current animate-bounce" />
                        <h2 className="font-display text-2xl font-bold mb-2">This time Gift hai PAKAA [SCAN PLIS] !</h2>
                        <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-lg border-4 border-primary/10 mt-4">
                          <img src={paymentQrCode} alt="UPI QR" className="w-44 h-44" />
                          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter"></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic font-medium"></p>
                        <button onClick={() => setShowQr(false)} className="mt-4 text-xs text-primary underline">Back to Video</button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-10 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">Made with 🎂 & ❤️ for an amazing celebration</p>
      </footer>
    </div>
  );
};

export default Index;
