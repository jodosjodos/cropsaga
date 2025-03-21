
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { predictCropYield, CropData, PredictionResult } from '@/api/cropPredictionService';
import { useNavigate } from 'react-router-dom';

const cropTypes = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'rice', label: 'Rice' },
  { value: 'corn', label: 'Corn' },
  { value: 'soybean', label: 'Soybean' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'sugarcane', label: 'Sugarcane' },
];

const soilTypes = [
  { value: 'loamy', label: 'Loamy' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'clay', label: 'Clay' },
  { value: 'silt', label: 'Silt' },
  { value: 'peaty', label: 'Peaty' },
  { value: 'chalky', label: 'Chalky' },
];

const formSchema = z.object({
  fieldName: z.string().min(2, {
    message: 'Field name must be at least 2 characters.',
  }),
  cropType: z.string({
    required_error: 'Please select a crop type.',
  }),
  soilType: z.string({
    required_error: 'Please select a soil type.',
  }),
  fieldSize: z.number().min(0.1, {
    message: 'Field size must be at least 0.1 hectares.',
  }),
  soilPH: z.number().min(3.5).max(9.5),
  nitrogenLevel: z.number().min(0).max(100),
  phosphorusLevel: z.number().min(0).max(100),
  potassiumLevel: z.number().min(0).max(100),
  irrigationSystem: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CropDataForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: '',
      fieldSize: 1,
      soilPH: 6.5,
      nitrogenLevel: 40,
      phosphorusLevel: 30,
      potassiumLevel: 25,
      irrigationSystem: '',
    },
  });
  
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setPrediction(null);
    
    try {
      // Ensure all required fields are present in the cropData object
      const cropData: CropData = {
        fieldName: data.fieldName,
        cropType: data.cropType,
        soilType: data.soilType,
        fieldSize: data.fieldSize,
        soilPH: data.soilPH,
        nitrogenLevel: data.nitrogenLevel,
        phosphorusLevel: data.phosphorusLevel,
        potassiumLevel: data.potassiumLevel,
      };
      
      // Add optional properties if they exist
      if (data.irrigationSystem) {
        cropData.irrigationSystem = data.irrigationSystem;
      }
      
      // Get prediction from service
      const result = await predictCropYield(cropData);
      
      // Store prediction results
      setPrediction(result);
      
      // Save the latest prediction to localStorage for the dashboard
      const savedPredictions = JSON.parse(localStorage.getItem('cropPredictions') || '[]');
      const newPrediction = {
        id: Date.now(),
        date: new Date().toISOString(),
        fieldName: data.fieldName,
        cropType: data.cropType,
        ...result
      };
      
      // Save up to 5 most recent predictions
      const updatedPredictions = [newPrediction, ...savedPredictions].slice(0, 5);
      localStorage.setItem('cropPredictions', JSON.stringify(updatedPredictions));
      
      toast({
        title: 'Prediction completed!',
        description: `Yield prediction for "${data.fieldName}" is ${result.yieldPrediction} tons.`,
      });
    } catch (error) {
      console.error('Error getting prediction:', error);
      toast({
        title: 'Error',
        description: 'Failed to get prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const viewDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <AnimatedCard className="max-w-2xl mx-auto w-full">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Crop Data Input</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fieldName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <Input placeholder="East Field" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fieldSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Size (hectares)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="1.0"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cropTypes.map(crop => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {soilTypes.map(soil => (
                          <SelectItem key={soil.value} value={soil.value}>
                            {soil.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="soilPH"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Soil pH</FormLabel>
                        <span className="text-sm font-medium">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={3.5}
                          max={9.5}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="py-4"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Acidic (3.5)</span>
                        <span>Neutral (7.0)</span>
                        <span>Alkaline (9.5)</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-4">Nutrient Levels (ppm)</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="nitrogenLevel"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Nitrogen (N)</FormLabel>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            className="py-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phosphorusLevel"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Phosphorus (P)</FormLabel>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            className="py-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="potassiumLevel"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Potassium (K)</FormLabel>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            className="py-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="irrigationSystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Irrigation System (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Drip irrigation, Sprinkler, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Specify the type of irrigation system used in this field.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Get Prediction'}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={viewDashboard}
              >
                View Dashboard
              </Button>
            </div>
          </form>
        </Form>
        
        {prediction && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold">Crop Prediction Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Yield Prediction</h4>
                <p className="text-2xl font-bold text-primary">{prediction.yieldPrediction} tons</p>
                <p className="text-sm text-muted-foreground">Estimated total yield for the field</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Crop Health Score</h4>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">{prediction.healthScore}/100</p>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${prediction.healthScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Overall crop health assessment</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-green-600">Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-yellow-600">Risk Factors</h4>
                <ul className="space-y-2 text-sm">
                  {prediction.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={viewDashboard}
              >
                Save & View Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
