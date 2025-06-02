import React, { useEffect, useRef, useState } from 'react';
import '../../app/skills-scroll.css';

interface SkillsSliderProps {
  skills: string[];
}

export const SkillsSlider: React.FC<SkillsSliderProps> = ({ skills }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let animationFrame: number;
    const speed = 1; // px per frame

    function animate() {
      if (!slider) return;
      if (!paused) {
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += speed;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  // Duplicate skills for seamless infinite scroll
  const allSkills = [...skills, ...skills];

  return (
    <div className="skills-slider-outer">
      <div
        className="skills-slider-inner"
        ref={sliderRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {allSkills.map((skill, idx) => (
          <span className="skill-item" key={idx}>{skill}</span>
        ))}
      </div>
    </div>
  );
};
