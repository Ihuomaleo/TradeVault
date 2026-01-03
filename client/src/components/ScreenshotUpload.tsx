import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ScreenshotUploadProps {
  screenshots: string[];
  onChange: (screenshots: string[]) => void;
  maxFiles?: number;
}

export function ScreenshotUpload({ screenshots, onChange, maxFiles = 5 }: ScreenshotUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newScreenshots: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        continue;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File too large:', file.size);
        continue;
      }

      // Convert to base64
      try {
        const base64 = await fileToBase64(file);
        newScreenshots.push(base64);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }

    // Update screenshots, respecting max files limit
    const updatedScreenshots = [...screenshots, ...newScreenshots].slice(0, maxFiles);
    onChange(updatedScreenshots);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updatedScreenshots = screenshots.filter((_, i) => i !== index);
    onChange(updatedScreenshots);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Screenshots (Before/After)</Label>
        <p className="text-xs text-muted-foreground">
          Upload up to {maxFiles} screenshots (max 5MB each)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {screenshots.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          onClick={handleBrowseClick}
          className="w-full gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Screenshots
        </Button>
      )}

      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video rounded-lg border overflow-hidden bg-muted">
                <img
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Screenshot {index + 1}</DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(index)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                Screenshot {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
