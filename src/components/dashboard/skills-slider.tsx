import React, { useEffect, useRef } from 'react';
import '../../app/skills-scroll.css';

interface SkillsSliderProps {
  skills: string[];
}

export const SkillsSlider: React.FC<SkillsSliderProps> = ({ skills }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let animationFrame: number;
    const speed = 1; // px per frame

    function animate() {
      if (!slider) return;
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += speed;
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Duplicate skills for seamless infinite scroll
  const allSkills = [...skills, ...skills];

  return (
    <div className="skills-slider-outer">
      <div className="skills-slider-inner" ref={sliderRef}>
        {allSkills.map((skill, idx) => (
          <span className="skill-item" key={idx}>{skill}</span>
        ))}
      </div>
    </div>
  );
};
