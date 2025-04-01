
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Legend() {
  const nodeTypes = [
    { name: "Function", color: "bg-code-blue", description: "Functions and methods" },
    { name: "Class", color: "bg-code-purple", description: "Classes and objects" },
    { name: "Variable", color: "bg-code-orange", description: "Variables and constants" },
    { name: "Import", color: "bg-code-green", description: "Import/require statements" },
    { name: "Module", color: "bg-code-pink", description: "Files and modules" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Diagram Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {nodeTypes.map((type) => (
            <div key={type.name} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
              <div>
                <div className="font-medium">{type.name}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
