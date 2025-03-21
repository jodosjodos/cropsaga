
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CropDataForm } from '@/components/forms/CropDataForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InputData() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 md:px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Input Agricultural Data</h1>
            <p className="text-muted-foreground">
              Record crop and field data for analysis and predictions.
            </p>
          </div>
          
          <Tabs defaultValue="crop" className="space-y-6">
            <TabsList>
              <TabsTrigger value="crop">Crop Data</TabsTrigger>
              <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
              <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="crop" className="space-y-4 animate-fade-in">
              <CropDataForm />
            </TabsContent>
            
            <TabsContent value="soil" className="space-y-4 animate-fade-in">
              <div className="bg-muted rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Soil Analysis Form</h3>
                <p className="text-muted-foreground mb-4">This feature will be available in the next update.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="irrigation" className="space-y-4 animate-fade-in">
              <div className="bg-muted rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Irrigation Data Form</h3>
                <p className="text-muted-foreground mb-4">This feature will be available in the next update.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
