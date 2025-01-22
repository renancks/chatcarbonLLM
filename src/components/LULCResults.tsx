// src/components/LULCResults.tsx
import { LULCAnalysis } from '../services/analysis/lulcService';

interface LULCResultsProps {
  analysis: LULCAnalysis | null;
}

export default function LULCResults({ analysis }: LULCResultsProps) {
  if (!analysis) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Land Use/Land Cover Analysis</h3>
      <div className="space-y-2">
        {analysis.classes.map(c => (
          <div key={c.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded" 
                style={{ backgroundColor: c.color }}
              />
              <span>{c.name}</span>
            </div>
            <span>{c.area.toFixed(2)} ha</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total Area:</span>
            <span>{analysis.totalArea.toFixed(2)} ha</span>
          </div>
        </div>
      </div>
    </div>
  );
}