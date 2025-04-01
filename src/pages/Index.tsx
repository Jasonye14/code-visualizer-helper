
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import CodeEditor from "@/components/CodeEditor";
import DiagramView from "@/components/DiagramView";
import { parseCodeToGraph } from "@/lib/codeParser";
import ExamplesDropdown from "@/components/ExamplesDropdown";
import Navbar from "@/components/Navbar";
import { FileUploader } from "@/components/FileUploader";
import Legend from "@/components/Legend";

export default function Index() {
  const [code, setCode] = useState("// Paste your code here or upload a file");
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [isVisualizing, setIsVisualizing] = useState(false);

  const handleVisualize = () => {
    try {
      setIsVisualizing(true);
      const result = parseCodeToGraph(code);
      setGraph(result);
      toast.success("Code visualization generated successfully!");
    } catch (error) {
      console.error("Error visualizing code:", error);
      toast.error("Failed to visualize code. Please check your input.");
    } finally {
      setIsVisualizing(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value || "");
  };

  const handleExampleSelect = (exampleCode: string) => {
    setCode(exampleCode);
    toast.info("Example code loaded!");
  };

  const handleFileUpload = (content: string) => {
    setCode(content);
    toast.success("File loaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6 px-4 md:px-6 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Code Visualizer</h1>
            <p className="text-muted-foreground">
              Transform your code into interactive diagrams for better understanding
            </p>
          </div>
          
          <div className="flex gap-2">
            <ExamplesDropdown onSelect={handleExampleSelect} />
            <FileUploader onUpload={handleFileUpload} />
            <Button onClick={handleVisualize} disabled={isVisualizing}>
              {isVisualizing ? "Visualizing..." : "Visualize Code"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="split" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="diagram">Diagram</TabsTrigger>
          </TabsList>
          
          <TabsContent value="split" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <CodeEditor value={code} onChange={handleCodeChange} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 h-[600px]">
                  <DiagramView graph={graph} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <CodeEditor value={code} onChange={handleCodeChange} height="600px" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diagram" className="mt-4">
            <Card>
              <CardContent className="p-4 h-[600px]">
                <DiagramView graph={graph} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Legend />
      </main>
    </div>
  );
}
