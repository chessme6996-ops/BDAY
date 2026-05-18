import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Gift, PartyPopper, Music, Cake, Map as MapIcon, X, DollarSign, Heart, Shirt, CalendarDays, Utensils, Sparkles } from "lucide-react";
import Confetti from "@/components/Confetti";
import Countdown from "@/components/Countdown";
import CameraBackground from "@/components/CameraBackground";
import MouseParticles from "@/components/MouseParticles";


const BIRTHDAY_DATE = new Date("2026-05-18T20:10:00");
const YOUR_UPI_ID = "7880958890@ibl";
const YOUR_NAME = "Patty";
const GIFT_AMOUNT = "501"; 
const GIFT_NOTE = "Birthday Gift for Patty";
const MAP_URL = "https://maps.app.goo.gl/em7xYfV7xEigoa5B8";


const WHEN_IMAGE = "/my-birthday-photo.png";
const DRESS_CODE_IMAGE = "/dress-code.jpg";
const SURPRISE_VIDEO = "https://cdn.discordapp.com/attachments/1320696785022353482/1482650823040307341/Hamster_Rat_Doing_Backflip_and_Hysterically_Laughing_Meme_Template_by_514MMemes.mp4?ex=6a0c19ae&is=6a0ac82e&hm=0fd20122ea56a19e8881208cdaf4c71d7bc0931650117f7a39c9f210943bdf41&";

const getChromeIntentUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const scheme = parsed.protocol.replace(":", "");
    const path = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
    return `intent://${path}#Intent;scheme=${scheme};package=com.android.chrome;end`;
  } catch {
    return url;
  }
};

const EventDetail = ({ icon: Icon, title, text, onClick }: { icon: any; title: string; text: string; onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-4 bg-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-lg border border-primary/10 hover:shadow-2xl transition-all ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}
  >
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
    </div>
    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{title}</h3>
    <p className="text-muted-foreground text-center text-sm sm:text-base">{text}</p>
    {onClick && <span className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">Tap for details</span>}
  </motion.div>
);

const Index = () => {
  const [activeModal, setActiveModal] = useState<"when" | "map" | "dress" | "gift" | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => Date.now() >= BIRTHDAY_DATE.getTime());

  const PAYMENT_URL = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${GIFT_AMOUNT}&tn=${encodeURIComponent(GIFT_NOTE)}&cu=INR`;
  const eventDateText = BIRTHDAY_DATE.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const eventTimeText = BIRTHDAY_DATE.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const eventDateTimeText = `${eventDateText} • ${eventTimeText}`;
  const paymentQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(PAYMENT_URL)}&margin=10`;
  const chromeVideoUrl = getChromeIntentUrl(SURPRISE_VIDEO);

  const closeModal = () => {
    setActiveModal(null);
    setShowQr(false);
  };

  useEffect(() => {
    if (isUnlocked) return;
    const id = window.setInterval(() => {
      if (Date.now() >= BIRTHDAY_DATE.getTime()) {
        setIsUnlocked(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [isUnlocked]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <CameraBackground />
      <MouseParticles />
      <Confetti />

      
      <section className="relative min-h-[60svh] sm:min-h-[70dvh] flex flex-col items-center justify-center px-4 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-4 px-2">
            Happy Birthday,<br />
            Patty !!!!!!!
          </h1>
        </motion.div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-md">
          Count down the moments to the big day. The party starts soon!
        </p>
        <div className="mt-6 sm:mt-8 w-full">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Countdown to the party
          </p>
          <Countdown targetDate={BIRTHDAY_DATE} />
        </div>
        {!isUnlocked && (
          <p className="mt-4 text-[11px] sm:text-xs text-muted-foreground">
            Unlocks on {eventDateText} at {eventTimeText}
          </p>
        )}
      </section>

      
      {isUnlocked && (
        <>
          <section className="py-8 sm:py-12 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-8">MUMAAA's <span className="text-primary">Big Day..........</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
                <EventDetail icon={Clock} title="When" text={eventDateTimeText} onClick={() => setActiveModal("when")} />
                <EventDetail icon={MapPin} title="Where" text="Tap to open the location" onClick={() => setActiveModal("map")} />
                <EventDetail icon={Gift} title="Dress Code" text="Smart and stylish" onClick={() => setActiveModal("dress")} />
              </div>
            </div>
          </section>

      
          <section className="py-10 sm:py-20 px-4 bg-muted/50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-8 sm:mb-12">My <span className="text-secondary">Birthday Wishlist</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[{ icon: Shirt, title: "Shirt & Pants", desc: "Keep me looking sharp." }, { icon: Cake, title: "Delicious Cake", desc: "A stunning custom cake!" }, { icon: Utensils, title: "KFC Bucket", desc: "The classic large bucket." }].map((item) => (
                  <div key={item.title} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"><item.icon className="text-primary w-8 h-8 sm:w-10 sm:h-10" /></div>
                    <h3 className="font-bold text-base sm:text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

      
          <section className="py-10 sm:py-20 px-4">
            <div className="max-w-md mx-auto text-center">
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setActiveModal("gift")} className="cursor-pointer bg-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border-2 border-dashed border-primary/30 shadow-2xl relative overflow-hidden group">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-6 animate-pulse" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Your surprise gift</h2>
                <p className="text-muted-foreground mb-8">Tap to open your surprise 🎁</p>
                <div className="py-3 px-6 sm:px-8 bg-primary text-primary-foreground rounded-full font-bold inline-block shadow-lg">Open Gift</div>
              </motion.div>
            </div>
          </section>

      
          <AnimatePresence>
            {activeModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-card border border-primary/20 w-full max-w-[92vw] sm:max-w-sm rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl z-50 max-h-[85svh] sm:max-h-[90vh] overflow-y-auto">
                  <button onClick={closeModal} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/20 text-white z-10"><X className="w-5 h-5" /></button>

                  {activeModal === "when" && (
                    <div className="flex flex-col"><img src={WHEN_IMAGE} className="h-56 sm:h-80 w-full object-cover" /><div className="p-6 text-center"><h2>Happyy..  bdayy... mummmaa</h2><p>{eventDateTimeText}</p></div></div>
                  )}
                  {activeModal === "map" && (
                    <div className="p-6 sm:p-8 text-center"><Heart className="w-8 h-8 mx-auto text-pink-500 mb-2 fill-current" /><h2>Tap the map, then scan the QR</h2><div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-lg border border-muted"><img src={paymentQrCode} className="w-32 h-32 sm:w-40 sm:h-40" /></div><a href={MAP_URL} target="_blank" className="flex items-center justify-center gap-3 w-full py-3 sm:py-4 bg-primary text-white rounded-2xl font-bold">Open Google Maps</a></div>
                  )}
                  {activeModal === "dress" && (
                    <div className="flex flex-col"><img src={DRESS_CODE_IMAGE} className="h-56 sm:h-80 w-full object-cover" /><div className="p-6 text-center"><h2>Dress code</h2><p>Smart and stylish</p></div></div>
                  )}

                  {activeModal === "gift" && (
                    <div className="flex flex-col">
                      <div className="h-48 sm:h-64 w-full bg-black overflow-hidden relative">
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
                      
                      <div className="p-6 sm:p-8 text-center">
                        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
                          <a
                            href={chromeVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg"
                          >
                            Open in Chrome
                          </a>
                          <a
                            href={SURPRISE_VIDEO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-semibold"
                          >
                            Open in browser
                          </a>
                        </div>
                        {!showQr ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="font-display text-xl sm:text-2xl font-bold mb-4">A message for you 🔊</h2>
                            <p className="text-muted-foreground text-sm mb-8 italic">"Listen first, then continue!"</p>
                            <button 
                              onClick={() => {
                                const v = document.getElementById('surpriseVideo') as HTMLVideoElement;
                                if(v) v.pause();
                                setShowQr(true);
                              }}
                              className="w-full py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                            >
                              <Gift className="w-5 h-5" /> Reveal gift
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <Heart className="w-8 h-8 mx-auto text-pink-500 mb-4 fill-current animate-bounce" />
                            <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">Your gift is ready — scan now!</h2>
                            <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-lg border-4 border-primary/10 mt-4">
                              <img src={paymentQrCode} alt="UPI QR" className="w-36 h-36 sm:w-44 sm:h-44" />
                              <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter"></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic font-medium"></p>
                            <button onClick={() => setShowQr(false)} className="mt-4 text-xs text-primary underline">Back to video</button>
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
            <p className="text-muted-foreground text-sm">Made with 🎂 & ❤️ for Patty's big day</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
