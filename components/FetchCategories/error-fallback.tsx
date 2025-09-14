// components/ui/ErrorFallback.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-10 border-red-300 border">
      <CardHeader>
        <CardTitle className="text-red-600">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700">{error.message}</p>
        <Button variant="outline" onClick={resetErrorBoundary}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
