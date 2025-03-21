
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PredictionResult } from '@/api/cropPredictionService';

interface SavedPrediction extends PredictionResult {
  id: number;
  date: string;
  fieldName: string;
  cropType: string;
}

export default function Predictions() {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<SavedPrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<SavedPrediction | null>(null);
  
  useEffect(() => {
    // Load predictions from localStorage
    const savedPredictions = JSON.parse(localStorage.getItem('cropPredictions') || '[]');
    setPredictions(savedPredictions);
    
    if (savedPredictions.length > 0) {
      setSelectedPrediction(savedPredictions[0]);
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getCropTypeLabel = (cropType: string) => {
    const cropMap: {[key: string]: string} = {
      'wheat': 'Wheat',
      'rice': 'Rice',
      'corn': 'Corn',
      'soybean': 'Soybean',
      'cotton': 'Cotton',
      'sugarcane': 'Sugarcane',
    };
    return cropMap[cropType] || cropType;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 md:px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Crop Predictions</h1>
            <p className="text-muted-foreground">
              View and analyze your crop prediction history.
            </p>
          </div>
          
          {predictions.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-4">No Predictions Yet</h2>
              <p className="text-muted-foreground mb-8">
                You haven't generated any crop predictions yet. Start by entering your field data.
              </p>
              <Button onClick={() => navigate('/input')}>
                Go to Input Form
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Prediction History</CardTitle>
                    <CardDescription>
                      Select a prediction to view details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {predictions.map((prediction) => (
                        <button
                          key={prediction.id}
                          onClick={() => setSelectedPrediction(prediction)}
                          className={`w-full text-left p-3 rounded-md transition-colors ${
                            selectedPrediction?.id === prediction.id
                              ? 'bg-primary/10 border-l-4 border-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="font-medium">{prediction.fieldName}</div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{getCropTypeLabel(prediction.cropType)}</span>
                            <span>{formatDate(prediction.date)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedPrediction ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedPrediction.fieldName}</CardTitle>
                          <CardDescription>
                            {getCropTypeLabel(selectedPrediction.cropType)} • {formatDate(selectedPrediction.date)}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/input')}>
                          New Prediction
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Yield Prediction</h3>
                          <p className="text-3xl font-bold text-primary">{selectedPrediction.yieldPrediction} tons</p>
                          <p className="text-sm text-muted-foreground">Estimated total yield</p>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Health Score</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-primary">{selectedPrediction.healthScore}/100</p>
                            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${selectedPrediction.healthScore}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">Overall crop health</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-green-600">Recommendations</h3>
                          <ul className="space-y-2">
                            {selectedPrediction.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-yellow-600">Risk Factors</h3>
                          <ul className="space-y-2">
                            {selectedPrediction.riskFactors.map((risk, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <span className="text-yellow-500 mt-1">⚠</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-3">Actions</h3>
                        <div className="flex flex-wrap gap-3">
                          <Button onClick={() => navigate('/dashboard')}>
                            View Dashboard
                          </Button>
                          <Button variant="outline">
                            Export Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center p-8">
                    <p className="text-muted-foreground">
                      Select a prediction from the list to view details
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
