
"use client";

import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download, AlertTriangle, CheckCircle } from 'lucide-react';

export function SeatingPlanForm() {
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState('');
  const [roomSpecs, setRoomSpecs] = useState('');
  const [responseContent, setResponseContent] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseContent(null);
    setError(null);
    setLoading(true);

    if (!file) {
      setError("Please select an Excel file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', mapping);
    formData.append('room_specs', roomSpecs);

    try {
      // Changed to use the internal proxy API route
      const res = await fetch('/api/generate-seating', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = `Error: ${res.status} ${res.statusText}`;
        try {
            // The proxy API returns JSON errors with an 'error' field
            const errorData = await res.json();
            errorMsg = errorData.error || errorData.detail || errorMsg;
        } catch (jsonError) {
            // If response is not JSON (e.g., network error before proxy, though less likely now), use status text
        }
        throw new Error(errorMsg);
      }
      
      const result = await res.blob();
      const blobUrl = window.URL.createObjectURL(result);
      
      // Try to get filename from Content-Disposition header
      let downloadFilename = "seating_plan.xlsx";
      const disposition = res.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          downloadFilename = matches[1].replace(/['"]/g, '');
        }
      }


      setResponseContent(
        <a
          href={blobUrl}
          download={downloadFilename}
          className="inline-flex items-center text-accent-foreground hover:text-accent-foreground/80 underline font-medium py-2 px-4 rounded-md bg-accent/20 hover:bg-accent/30 transition-colors"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Seating Plan
        </a>
      );
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl rounded-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold font-headline text-primary">
          Seating Sage
        </CardTitle>
        <CardDescription className="text-md text-foreground/80 mt-1">
          🎓 Smart Seating Plan Generator
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="excel-file" className="font-medium">Excel File <span className="text-destructive">*</span></Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              required
              onChange={handleFileChange}
              className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary file:rounded-md file:border-0 file:px-3 file:py-1.5 hover:file:bg-primary/20"
            />
            {file && <p className="text-xs text-muted-foreground pt-1">Selected: {file.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapping" className="font-medium">Mapping <span className="text-destructive">*</span></Label>
            <Input
              id="mapping"
              type="text"
              required
              value={mapping}
              onChange={(e) => setMapping(e.target.value)}
              placeholder="e.g., ICT202-16407722-16401523-ECE, ..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-specs" className="font-medium">Room Specs <span className="text-destructive">*</span></Label>
            <Input
              id="room-specs"
              type="text"
              required
              value={roomSpecs}
              onChange={(e) => setRoomSpecs(e.target.value)}
              placeholder="e.g., c-3012:48:6x8,a-318:63:9x7, ..."
              className="text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-base py-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Seating Plan'
            )}
          </Button>
        </form>
      </CardContent>
      {(responseContent || error) && (
        <CardFooter className="flex flex-col items-center justify-center pt-6 pb-6">
          {responseContent && !error && (
            <div className="flex items-center text-green-600 font-medium p-3 bg-green-500/10 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              Seating plan generated successfully!
            </div>
          )}
          {responseContent && <div className="mt-4">{responseContent}</div>}
          {error && (
            <div className="flex items-center text-destructive font-medium p-3 bg-destructive/10 rounded-md w-full">
              <AlertTriangle className="mr-2 h-5 w-5 shrink-0" />
              <span className="break-all">{error}</span>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
