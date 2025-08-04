import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Code } from 'lucide-react';

export default function Codes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Codes</h1>
          <p className="text-gray-600 mt-2">
            Manage access codes and tokens
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Generate Code</span>
        </Button>
      </div>

      {/* Placeholder Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Access Codes</span>
          </CardTitle>
          <CardDescription>
            Code management functionality will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Code management features will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}