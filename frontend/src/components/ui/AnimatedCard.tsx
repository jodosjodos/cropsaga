
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: 'tilt' | 'scale' | 'glow' | 'none';
  intensity?: 'subtle' | 'medium' | 'strong';
  glassEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AnimatedCard({
  hoverEffect = 'tilt',
  intensity = 'medium',
  glassEffect = true,
  className,
  children,
  ...props
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Define intensity values
  const intensityMap = {
    subtle: { tilt: 2, scale: 1.01, glow: '0 0 15px' },
    medium: { tilt: 5, scale: 1.03, glow: '0 0 25px' },
    strong: { tilt: 10, scale: 1.05, glow: '0 0 35px' }
  };
  
  const intensityValue = intensityMap[intensity];
  
  // Handle mouse move for tilt and glow effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hoverEffect === 'none') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -intensityValue.tilt;
    const rotateYValue = ((x - centerX) / centerX) * intensityValue.tilt;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setMouseX(x / rect.width);
    setMouseY(y / rect.height);
  };
  
  // Clear effects when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };
  
  // Apply enter animation when component mounts
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const timeout = setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300',
        glassEffect && 'glass-card',
        !glassEffect && 'bg-card border shadow-medium',
        className
      )}
      style={{
        transform: hoverEffect === 'tilt' && isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : hoverEffect === 'scale' && isHovered
            ? `scale(${intensityValue.scale})`
            : 'translate3d(0, 0, 0)',
        transition: 'all 0.3s ease',
        boxShadow: hoverEffect === 'glow' && isHovered
          ? `${intensityValue.glow} rgba(var(--primary), 0.2)`
          : ''
      }}
      {...props}
    >
      {hoverEffect === 'glow' && isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, rgba(var(--primary), 0.15), transparent 50%)`,
            opacity: 0.7
          }}
        />
      )}
      {children}
    </div>
  );
}
