
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Cloud, CloudRain, Sun, CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  location?: string;
  temperature?: string;
  condition?: string;
  forecast?: {
    day: string;
    temp: string;
    icon: string;
  }[];
  className?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  precipitation: number;
  windSpeed: number;
}

export function WeatherWidget({ 
  location = 'Current Farm Location', 
  temperature,
  condition,
  forecast = [],
  className 
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(!temperature); // Only fetch if no temperature provided
  
  // Simulate fetching weather data if not provided via props
  useEffect(() => {
    if (temperature) {
      // If temperature is provided via props, don't fetch
      setIsLoading(false);
      return;
    }
    
    const fetchWeather = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock weather data
      const mockWeatherData: WeatherData = {
        temperature: 24 + Math.random() * 5,
        humidity: 40 + Math.random() * 30,
        weather: ['sunny', 'cloudy', 'rainy', 'partly-cloudy'][Math.floor(Math.random() * 4)] as WeatherData['weather'],
        precipitation: Math.random() * 20,
        windSpeed: 5 + Math.random() * 10
      };
      
      setWeather(mockWeatherData);
      setIsLoading(false);
    };
    
    fetchWeather();
  }, [temperature]);
  
  const getWeatherIcon = (iconType?: string) => {
    // If iconType is provided, use it to determine the icon
    if (iconType) {
      switch (iconType) {
        case 'sunny':
          return <Sun className="text-yellow-500" size={24} />;
        case 'partly-cloudy':
          return <CloudSun className="text-agri-sky-DEFAULT" size={24} />;
        case 'cloudy':
          return <Cloud className="text-gray-400" size={24} />;
        case 'rainy':
          return <CloudRain className="text-agri-sky-DEFAULT" size={24} />;
        default:
          return <Sun className="text-yellow-500" size={24} />;
      }
    }
    
    // Use weather state for main display
    if (!weather) return <Sun className="text-agri-sky-DEFAULT" size={48} />;
    
    switch (weather.weather) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={48} />;
      case 'cloudy':
        return <Cloud className="text-gray-400" size={48} />;
      case 'rainy':
        return <CloudRain className="text-agri-sky-DEFAULT" size={48} />;
      case 'partly-cloudy':
        return <CloudSun className="text-agri-sky-DEFAULT" size={48} />;
      default:
        return <Sun className="text-yellow-500" size={48} />;
    }
  };
  
  // Render widget with props data if available
  const renderPropBasedWidget = () => {
    return (
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{location}</h3>
            <p className="text-3xl font-bold mt-2">{temperature}</p>
            <p className="text-sm font-medium text-muted-foreground capitalize mt-1">
              {condition}
            </p>
          </div>
          <div className="flex items-center justify-center">
            {condition && (
              <div className="w-12 h-12 flex items-center justify-center">
                {getWeatherIcon(condition.toLowerCase())}
              </div>
            )}
          </div>
        </div>
        
        {forecast && forecast.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-6">
            {forecast.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-sm font-medium">{day.day}</span>
                {getWeatherIcon(day.icon)}
                <span className="text-sm">{day.temp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <AnimatedCard 
      hoverEffect="glow"
      className={cn('overflow-hidden', className)}
    >
      {temperature ? (
        renderPropBasedWidget()
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center p-6 h-48 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-24 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      ) : weather ? (
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{location}</h3>
              <p className="text-3xl font-bold mt-2">{weather.temperature.toFixed(1)}°C</p>
              <p className="text-sm font-medium text-muted-foreground capitalize mt-1">
                {weather.weather.replace('-', ' ')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              {getWeatherIcon()}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center">
              <Droplets className="text-agri-sky-DEFAULT mb-1 h-5 w-5" />
              <span className="text-sm font-medium">{weather.humidity.toFixed(0)}%</span>
              <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
              <CloudRain className="text-agri-sky-DEFAULT mb-1 h-5 w-5" />
              <span className="text-sm font-medium">{weather.precipitation.toFixed(1)} mm</span>
              <span className="text-xs text-muted-foreground">Precip.</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind className="text-agri-sky-DEFAULT mb-1 h-5 w-5" />
              <span className="text-sm font-medium">{weather.windSpeed.toFixed(1)} km/h</span>
              <span className="text-xs text-muted-foreground">Wind</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load weather data</p>
        </div>
      )}
    </AnimatedCard>
  );
}
