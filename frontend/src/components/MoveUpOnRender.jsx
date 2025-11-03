import React, { useEffect, useRef, useState } from "react";

const MoveUpOnRender = ({ children, id }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    sessionStorage.getItem(`animated-${id}`) === "true"
  );

  useEffect(() => {
    if (isVisible) return; // Prevent re-triggering if already animated

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          sessionStorage.setItem(`animated-${id}`, "true"); // Store in session
          observer.disconnect(); // Stop observing
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, id]);

  return (
    <div
      ref={containerRef}
      className={`transition-transform transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
};

export default MoveUpOnRender;