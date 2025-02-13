import React, { useState, useEffect } from "react";
import { FloatingElements } from "./floatinghearts";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Celebration } from "./Celebration"; // Import the celebration component

interface EnvelopeProps {
  // onResponse can be added if needed
  onClick: () => void;
}

const Envelope: React.FC<EnvelopeProps> = () => {
  const [isFlapped, setIsFlapped] = useState(false);
  const [audio] = useState(new Audio("/photo/music.mp3"));
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(-1); // Start with -1 for initial delay
  const [showProposal, setShowProposal] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false); // New state for celebration

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audio.play();
        audio.loop = true;
      } catch (err) {
        console.log("Audio autoplay was prevented by browser");
      }
    };
    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);
  useEffect(() => {
    if (isFlapped) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => {
          if (prevIndex === 6) {
            // Change from 4 to 6
            clearInterval(interval);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 3000);

      setTimeout(() => {
        setCurrentPhotoIndex(0);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isFlapped]);

  // When the envelope is clicked, the envelope moves down while the paper moves up
  const handleEnvelopeClick = () => {
    setIsFlapped(true);
  };

  const handleNoClick = () => {
    setNoButtonPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  const handleYesClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setShowHeart(true);
    }, 2000);

    setTimeout(() => {
      setIsFlapped(false);
      setShowCelebration(true); // Show celebration after closing envelope
    }, 1000);
  };

  const items = [
    { type: "photo", id: 1, src: "/photo/1.jpg" },
    { type: "photo", id: 2, src: "/photo/2.jpg" },
    { type: "photo", id: 3, src: "/photo/3.jpg" },
    { type: "photo", id: 4, src: "/photo/4.jpg" },
    { type: "photo", id: 5, src: "/photo/5.jpg" },
    { type: "photo", id: 6, src: "/photo/6.jpg" },
    { type: "letter" },
  ];

  // Render Celebration if showCelebration is true
  if (showCelebration) {
    return <Celebration />;
  }

  return (
    <div className="container h-screen grid place-items-center">
      <FloatingElements />
      <motion.div
        className={`envelope-wrapper bg-[#f5edd1] shadow-lg relative ${
          isFlapped ? "flap" : ""
        }`}
        onClick={!isFlapped ? handleEnvelopeClick : undefined}
        style={{ transformOrigin: "center", scale: 1, zIndex: 10 }}
        animate={
          isFlapped
            ? {
                y:
                  currentPhotoIndex === 6
                    ? showProposal
                      ? 150 // Return to normal position when showing proposal
                      : 300 // Move down when showing photos/letter
                    : 180,
                opacity: showHeart ? 0 : 1,
              }
            : { y: 0 }
        }
        transition={{ duration: 0.8 }}
      >
        <div className="envelope relative w-[300px] h-[230px]">
          <motion.div
            className="letter absolute right-[10%] bottom-0 w-[80%] h-[90%] bg-white text-center shadow-md p-5"
            initial={{
              y: 0,
              opacity: 1,
              height: currentPhotoIndex === 6 ? 320 : 210, // Change from 4 to 6
            }}
            animate={
              isFlapped
                ? {
                    y: -150,
                    opacity: 1,
                    height: showProposal
                      ? 230
                      : currentPhotoIndex === 6 // Change from 4 to 6
                      ? 400
                      : 210,
                  }
                : {}
            }
            transition={{ duration: 0.8 }}
          >
            {isFlapped && (
              <div
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "top center",
                  marginTop: "-10px",
                }}
                className="text font-sans text-gray-700 text-left text-sm"
              >
                {/* Slideshow for photos and texts */}
                <motion.div
                  className="slideshow relative w-full h-[200px] mb-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.5,
                      },
                    },
                    hidden: {},
                  }}
                >
                  {items.map((item, i) => {
                    if (item.type === "photo" && i === currentPhotoIndex) {
                      return (
                        <motion.div
                          key={`photo-${item.id}`}
                          className="absolute inset-0 bg-gray-200 border rounded flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ marginTop: "30px" }}
                          transition={{ duration: 0.5 }}
                        >
                          <img
                            src={item.src}
                            alt={`Photo ${item.id}`}
                            className="object-cover w-full h-full"
                          />
                        </motion.div>
                      );
                    }
                    return null;
                  })}

                  {/* Love letter appears first when photo slideshow is done */}
                  {currentPhotoIndex === 6 && !showProposal && (
                    <motion.div
                      key="love-letter"
                      className="letter-content relative"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.8, delay: 1 }}
                      style={{ marginTop: "30px" }}
                    >
                      <p
                        className="romantic-text text-l text-gray-700 leading-relaxed mb-8 w-full"
                        style={{
                          textAlign: "justify",
                          whiteSpace: "normal",
                          marginTop: "-30px",
                        }}
                      >
                        Happy Valentine’s Day, my forever life partner!
                        <br />
                        <br />
                        Love, napaka blessed at grateful ko na ikaw ang ibinigay
                        sa akin ni Lord. Hindi ko akalain na magiging ganito
                        kaganda at kapayapa ang buhay ko dahil sayo. You are my
                        answered prayer, my dream come true. Ikaw ang nagbigay
                        ng kulay at liwanag sa mundo ko.
                        <br />
                        Salamat sa pagiging selfless at mapagmahal na asawa. You
                        make me feel so loved, cherished, and safe, everything
                        looks perfect because of you. Mula noon hanggang ngayon,
                        ikaw pa rin ang gusto kong makasama sa bawat hirap at
                        ginhawa. You are my home, my peace, and my greatest
                        blessing.
                        <br />
                        <div className="text-right text-pink-300"></div>
                      </p>

                      {/* Floating video 1 */}
                      <motion.div
                        className="floating-video absolute"
                        style={{
                          top: "0%",
                          right: "-83%",
                          width: "120px",
                          height: "200px",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        initial={{ x: 0, y: 0 }}
                        animate={{
                          x: [0, 5, 0, -5, 0],
                          y: [0, -5, 0, 5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <video
                          src="/photo/vid2.mov"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          style={{
                            width: "200px",
                            height: "200px",
                            pointerEvents: "none",
                          }}
                        />
                      </motion.div>

                      {/* Floating video 2 */}
                      <motion.div
                        className="floating-video absolute"
                        style={{
                          top: "0%",
                          right: "125%",
                          width: "120px",
                          height: "200px",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        initial={{ x: 0, y: 0 }}
                        animate={{
                          x: [0, 5, 0, -5, 0],
                          y: [0, -5, 0, 5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <video
                          src="/photo/vid1.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          style={{
                            width: "200px",
                            height: "200px",
                            pointerEvents: "none",
                          }}
                        />
                      </motion.div>

                      <button
                        onClick={() => setShowProposal(true)}
                        className="rounded-full w-10 h-10 bg-red-500 text-white flex items-center justify-center mx-auto"
                        aria-label="Skip letter and go to proposal"
                        style={{ marginTop: "-20px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  )}

                  {/* Proposal content with buttons appears last */}
                  {showProposal && (
                    <motion.div
                      key="proposal"
                      className="letter-content relative"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      style={{ marginTop: "40px" }}
                    >
                      <p className="heading-text text-xl text-pink-500 mb-8 text-center leading-relaxed">
                        To more love and heart’s day with you love! 
                        <br/>
                        Happy Valentine’s Day! ♥️
                      </p>

                      <button
                        onClick={handleYesClick}
                        className="rounded-full w-10 h-10 bg-red-500 text-white flex items-center justify-center mx-auto"
                        aria-label="Go to celebration"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                  {showHeart && (
                    <motion.div
                      className="fixed inset-0 flex items-center justify-center bg-white z-100"
                      initial={{ scale: 0 }}
                      animate={{ scale: 50 }}
                      transition={{ duration: 1 }}
                    >
                      <div className="w-16 h-16 bg-red-500 rounded-full relative">
                        <div className="absolute top-0 left-0 w-16 h-16 bg-red-500 rounded-full transform rotate-45"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 bg-red-500 rounded-full transform -rotate-45"></div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
        <motion.div
          className="heart absolute"
          animate={{
            rotate: isFlapped ? 90 : 45,
            scale: isFlapped ? 1.2 : 1,
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      </motion.div>

      <style>{`
        .envelope-wrapper > .envelope::before {
          content: "";
          position: absolute;
          top: 0;
          z-index: 2;
          border-top: 130px solid #ecdeb8;
          border-right: 150px solid transparent;
          border-left: 150px solid transparent;
          transform-origin: top;
          transition: all 0.5s ease-in-out 0.7s;
        }

        .envelope-wrapper > .envelope::after {
          content: "";
          position: absolute;
          z-index: 2;
          width: 0px;
          height: 0px;
          border-top: 130px solid transparent;
          border-right: 150px solid #e6cfa7;
          border-bottom: 100px solid #e6cfa7;
          border-left: 150px solid #e6cfa7;
        }

        .heart {
          width: 50px;
          height: 50px;
          background: rgb(255, 0, 0);
          position: absolute;
          top: 250px;
          right: 130px;
          transform: translate(-50px, 0) rotate(45deg);
          transition: transform 0.5s ease-in-out 1s;
          z-index: 4;
        }

        .heart:before, 
        .heart:after {
          content: "";
          position: absolute;
          width: 50px;
          height: 50px;
          background-color: rgb(255, 0, 0);
          border-radius: 50%;
        }

        .heart:before {
          top: -25px;
          left: 0;
        }

        .heart:after {
          left: 25px;
          top: 0;
        }

        .flap > .envelope:before {
          transform: rotateX(180deg);
          z-index: 0;
        }

        .flap > .envelope > .letter {
          bottom: 100px;
          transition-delay: 1s;
        }

        .envelope > .letter {
          transition: all 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
