
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, LineChart, PieChart } from '@/components/ui/chart';

export interface DashboardChartProps {
  title: string;
  description: string;
  data: any[];
  type: 'bar' | 'line' | 'area' | 'pie';
  dataKeys: string[];
  colors: string[];
  className?: string;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  description,
  data,
  type,
  dataKeys,
  colors,
  className,
}) => {
  // Render the appropriate chart based on the type prop
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart
            data={data}
            index="name"
            categories={dataKeys}
            colors={colors}
            valueFormatter={(value) => `${value}%`}
            yAxisWidth={48}
            className="h-[300px] mt-4"
          />
        );
      case 'line':
        return (
          <LineChart
            data={data}
            index="name"
            categories={dataKeys}
            colors={colors}
            valueFormatter={(value) => `${value}%`}
            yAxisWidth={48}
            className="h-[300px] mt-4"
          />
        );
      case 'area':
        return (
          <AreaChart
            data={data}
            index="name"
            categories={dataKeys}
            colors={colors}
            valueFormatter={(value) => `${value}%`}
            yAxisWidth={48}
            className="h-[300px] mt-4"
          />
        );
      case 'pie':
        return (
          <PieChart
            data={data}
            category="value"
            index="name"
            colors={colors}
            valueFormatter={(value) => `${value}%`}
            className="h-[300px] mt-4"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};
