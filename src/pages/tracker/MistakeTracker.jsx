import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { mistakeCategories } from '../../data/dummyData';
import { BookOpen, AlertTriangle, Filter } from 'lucide-react';

export default function MistakeTracker() {
  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="h2 font-bold flex items-center gap-2"><BookOpen className="text-primary"/> My Mistake Book</h1>
          <p className="subtitle">Review mistakes to avoid them in the final exam.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2"><Filter size={16}/> Filter by Subject</Button>
      </div>

      {/* Categories Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {mistakeCategories.map(cat => (
           <Card key={cat.type} className="flex flex-col items-center justify-center text-center py-6 hover:shadow-md cursor-pointer transition">
             <div className="text-3xl font-black mb-1" style={{ color: cat.color }}>{cat.count}</div>
             <div className="text-sm font-semibold text-muted">{cat.type}</div>
           </Card>
        ))}
      </div>

      <h3 className="font-bold text-lg mb-4">Saved Mistakes</h3>
      <div className="flex flex-col gap-4">
         <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <div className="flex gap-2 mb-2">
                 <Badge variant="warning">Physics</Badge>
                 <Badge variant="neutral">Vectors</Badge>
                 <Badge variant="danger">Formula Error</Badge>
              </div>
              <p className="text-lg font-medium mb-3">If vector A x B = 0 and A.B = 0, what can be concluded?</p>
              <div className="text-sm p-3 bg-danger-light rounded-md text-danger font-semibold flex items-start gap-2">
                 <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                 I chose "A is parallel to B", but actually either A or B must be a null vector. I mixed up the cross text definitions.
              </div>
           </div>
           <div className="flex flex-col gap-3 min-w-[140px]">
              <Button variant="primary">Revise Concept</Button>
              <Button variant="ghost" className="text-success">Mark as Resolved</Button>
           </div>
         </Card>
      </div>
    </div>
  );
}
