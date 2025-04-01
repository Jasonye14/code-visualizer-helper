
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface FileUploaderProps {
  onUpload: (content: string) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Please upload a file smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onUpload(content);
    };
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css"
        className="hidden"
      />
      <Button variant="outline" onClick={handleButtonClick}>
        <UploadIcon className="mr-2 h-4 w-4" /> Upload
      </Button>
    </>
  );
}
