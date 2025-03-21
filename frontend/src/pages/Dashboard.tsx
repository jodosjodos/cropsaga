
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CircleAlert, Droplets, Sprout, SunIcon, Thermometer } from 'lucide-react';

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate content loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Mock data for charts
  const cropYieldData = [
    { name: 'Corn', actual: 85, predicted: 89 },
    { name: 'Wheat', actual: 72, predicted: 75 },
    { name: 'Soybeans', actual: 78, predicted: 80 },
    { name: 'Rice', actual: 92, predicted: 88 }
  ];
  
  const soilHealthData = [
    { name: 'Field A', value: 87 },
    { name: 'Field B', value: 76 },
    { name: 'Field C', value: 92 },
    { name: 'Field D', value: 84 }
  ];
  
  const recentPredictions = [
    {
      id: 1,
      fieldName: 'North Field',
      cropType: 'Corn',
      soilType: 'Loam',
      yield: 89,
      health: 92,
      date: '2023-08-15',
    },
    {
      id: 2,
      fieldName: 'East Field',
      cropType: 'Wheat',
      soilType: 'Clay',
      yield: 75,
      health: 84,
      date: '2023-08-10',
    },
    {
      id: 3,
      fieldName: 'South Field',
      cropType: 'Soybeans',
      soilType: 'Sandy Loam',
      yield: 80,
      health: 88,
      date: '2023-08-05',
    }
  ];
  
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Potential drought risk for East Field in the next 7 days',
      date: '2023-08-16',
    },
    {
      id: 2,
      type: 'info',
      message: 'Optimal planting conditions for West Field',
      date: '2023-08-15',
    },
    {
      id: 3,
      type: 'alert',
      message: 'Pest pressure detected in South Field - immediate action recommended',
      date: '2023-08-14',
    }
  ];
  
  const currentConditions = [
    { name: 'Temperature', value: '78°F', icon: Thermometer, color: 'text-yellow-500' },
    { name: 'Humidity', value: '65%', icon: Droplets, color: 'text-blue-500' },
    { name: 'Soil Moisture', value: 'Adequate', icon: Sprout, color: 'text-green-500' },
    { name: 'UV Index', value: 'Moderate', icon: SunIcon, color: 'text-amber-500' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your crops and get insights for optimal farm management.
              </p>
            </div>
            
            <WeatherWidget
              location="Farmville, CA"
              temperature="78°F"
              condition="Sunny"
              forecast={[
                { day: 'Wed', temp: '76°F', icon: 'sunny' },
                { day: 'Thu', temp: '80°F', icon: 'partly-cloudy' },
                { day: 'Fri', temp: '75°F', icon: 'cloudy' },
                { day: 'Sat', temp: '72°F', icon: 'rainy' }
              ]}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {currentConditions.map((condition, index) => (
              <Card key={index} className={`transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
                    style={{ transitionDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{condition.name}</p>
                    <p className="text-2xl font-bold">{condition.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${condition.color}`}>
                    <condition.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:inline-flex">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="predictions" className="flex-1">Predictions</TabsTrigger>
              <TabsTrigger value="alerts" className="flex-1">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <DashboardChart
                  title="Crop Yield Comparison"
                  description="Actual vs. Predicted Yields (%)"
                  data={cropYieldData}
                  type="bar"
                  dataKeys={['actual', 'predicted']}
                  colors={['#10b981', '#3b82f6']}
                  className={`transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                />
                
                <DashboardChart
                  title="Soil Health Index"
                  description="Current soil health scores by field"
                  data={soilHealthData}
                  type="area"
                  dataKeys={['value']}
                  colors={['#84cc16']}
                  className={`transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="predictions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                  <CardDescription>
                    Latest yield and health predictions for your fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-3 font-medium">Field</th>
                          <th className="p-3 font-medium">Crop</th>
                          <th className="p-3 font-medium">Soil Type</th>
                          <th className="p-3 font-medium">Yield</th>
                          <th className="p-3 font-medium">Health</th>
                          <th className="p-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPredictions.map((prediction) => (
                          <tr key={prediction.id} className="border-b last:border-b-0 hover:bg-muted/50">
                            <td className="p-3">{prediction.fieldName}</td>
                            <td className="p-3">{prediction.cropType}</td>
                            <td className="p-3">{prediction.soilType}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {prediction.yield}%
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {prediction.health}%
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground">{prediction.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Alerts</CardTitle>
                  <CardDescription>
                    Important notifications and recommendations for your farm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start p-4 border rounded-lg">
                        <div className="mr-4 mt-0.5">
                          <CircleAlert className={`h-5 w-5 ${
                            alert.type === 'warning' ? 'text-amber-500' : 
                            alert.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">{alert.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
