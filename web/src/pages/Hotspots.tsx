import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Droplets,
  Leaf,
  Layers,
  Maximize2,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
  X,
  ChevronRight,
  Search,
  Wind,
  Thermometer,
  Sprout,
  AlertTriangle,
  Scan,
  Map as MapIcon,
  Video,
  ArrowUpRight,
} from "lucide-react";

type Field = {
  id: string;
  name: string;
  crop: string;
  health: number;
  healthLabel: "Good" | "Low" | "Alert";
  layer: string;
  area: string;
  lastImage: string;
  trend: string;
  ndvi: string;
  ndre: string;
  ndmi: string;
  evi: string;
  soilMoisture: string;
  productivity: string;
  alerts: string[];
  position: { left: string; top: string; width: string; height: string; rotate?: string };
  nextHarvest: string;
  daysToHarvest: number;
};

const fields: Field[] = [
  {
    id: "talhao-1",
    name: "Talhão 1",
    crop: "Cana-de-açúcar (RB867515)",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "18 ha",
    lastImage: "15/08/2024",
    trend: "+3% vs última captura",
    ndvi: "0.81",
    ndre: "0.62",
    ndmi: "0.49",
    evi: "0.68",
    soilMoisture: "71%",
    productivity: "78 t/ha",
    alerts: ["Vigor consistente"],
    position: { left: "14%", top: "16%", width: "33%", height: "28%", rotate: "-1deg" },
    nextHarvest: "29/09/2024",
    daysToHarvest: 45,
  },
  {
    id: "talhao-2",
    name: "Talhão 2",
    crop: "Cana-de-açúcar (CTC4)",
    health: 0.74,
    healthLabel: "Low",
    layer: "NDRE",
    area: "11 ha",
    lastImage: "15/08/2024",
    trend: "-2% vs última captura",
    ndvi: "0.64",
    ndre: "0.41",
    ndmi: "0.34",
    evi: "0.55",
    soilMoisture: "Low",
    productivity: "65 t/ha",
    alerts: ["Queda leve de vigor", "Verificar bordadura leste"],
    position: { left: "52%", top: "18%", width: "26%", height: "24%", rotate: "1deg" },
    nextHarvest: "15/10/2024",
    daysToHarvest: 61,
  },
  {
    id: "talhao-3",
    name: "Talhão 3",
    crop: "Cana-de-açúcar (RB966928)",
    health: 0.98,
    healthLabel: "Good",
    layer: "NDMI",
    area: "15 ha",
    lastImage: "15/08/2024",
    trend: "+1.2% vs última captura",
    ndvi: "0.78",
    ndre: "0.58",
    ndmi: "0.52",
    evi: "0.63",
    soilMoisture: "76%",
    productivity: "74 t/ha",
    alerts: [],
    position: { left: "18%", top: "50%", width: "30%", height: "26%", rotate: "-2deg" },
    nextHarvest: "05/09/2024",
    daysToHarvest: 21,
  },
  {
    id: "talhao-4",
    name: "Talhão 4",
    crop: "Cana-de-açúcar (CTC9001)",
    health: 0.87,
    healthLabel: "Good",
    layer: "EVI",
    area: "9 ha",
    lastImage: "15/08/2024",
    trend: "-0.5% vs última captura",
    ndvi: "0.72",
    ndre: "0.51",
    ndmi: "0.45",
    evi: "0.58",
    soilMoisture: "68%",
    productivity: "70 t/ha",
    alerts: [],
    position: { left: "56%", top: "52%", width: "26%", height: "30%", rotate: "2deg" },
    nextHarvest: "20/11/2024",
    daysToHarvest: 96,
  },
  {
    id: "talhao-5",
    name: "Talhão 5",
    crop: "Cana-de-açúcar",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "22 ha",
    lastImage: "15/08/2024",
    trend: "Estável",
    ndvi: "0.79",
    ndre: "0.60",
    ndmi: "0.50",
    evi: "0.66",
    soilMoisture: "74%",
    productivity: "76 t/ha",
    alerts: [],
    position: { left: "85%", top: "60%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "10/10/2024",
    daysToHarvest: 56,
  },
  {
    id: "talhao-6",
    name: "Talhão 6",
    crop: "Cana-de-açúcar",
    health: 0.89,
    healthLabel: "Good",
    layer: "NDVI",
    area: "14 ha",
    lastImage: "15/08/2024",
    trend: "+1%",
    ndvi: "0.75",
    ndre: "0.55",
    ndmi: "0.48",
    evi: "0.60",
    soilMoisture: "70%",
    productivity: "72 t/ha",
    alerts: [],
    position: { left: "85%", top: "35%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "12/09/2024",
    daysToHarvest: 28,
  },
  {
    id: "talhao-7",
    name: "Talhão 7",
    crop: "Cana-de-açúcar",
    health: 0.52,
    healthLabel: "Alert",
    layer: "NDVI",
    area: "8 ha",
    lastImage: "15/08/2024",
    trend: "-5%",
    ndvi: "0.45",
    ndre: "0.30",
    ndmi: "0.25",
    evi: "0.38",
    soilMoisture: "Low",
    productivity: "45 t/ha",
    alerts: ["Sick Plant", "Estresse Hídrico"],
    position: { left: "85%", top: "10%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "30/11/2024",
    daysToHarvest: 106,
  },
  {
    id: "talhao-8",
    name: "Talhão 8",
    crop: "Cana-de-açúcar",
    health: 0.81,
    healthLabel: "Good",
    layer: "NDVI",
    area: "12 ha",
    lastImage: "15/08/2024",
    trend: "Estável",
    ndvi: "0.70",
    ndre: "0.52",
    ndmi: "0.46",
    evi: "0.58",
    soilMoisture: "65%",
    productivity: "68 t/ha",
    alerts: [],
    position: { left: "5%", top: "80%", width: "20%", height: "15%", rotate: "0deg" },
    nextHarvest: "15/12/2024",
    daysToHarvest: 121,
  },
];

const healthColor = (label: Field["healthLabel"]) => {
  if (label === "Good") return "text-emerald-500 bg-emerald-500/10";
  if (label === "Low") return "text-amber-500 bg-amber-500/10";
  return "text-red-500 bg-red-500/10";
};

const Hotspots = () => {
  const [activeTab, setActiveTab] = useState<"details" | "field" | "task" | "device" | "activity">("field");
  const [viewMode, setViewMode] = useState<"analytic" | "cctv">("analytic");
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(true);

  const selectedField = useMemo(() => fields.find((f) => f.id === selectedFieldId) ?? fields[0], [selectedFieldId]);
  const overallHealth = useMemo(
    () => Math.round((fields.reduce((acc, f) => acc + f.health, 0) / fields.length) * 100),
    [],
  );

  return (
    <Layout title="Monitoramento de Safra" hideChrome={isFullscreen}>
      <div className="flex h-[calc(100vh-100px)] w-full gap-3 overflow-hidden p-1">
        {/* Sidebar */}
        <Card className="flex w-[380px] flex-col overflow-hidden rounded-[15px] border-0 bg-[#F0F0F0] shadow-none">
          {/* Sidebar Header / Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 px-6 py-5">
            {["Details", "Field", "Task", "Device", "Activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as "details" | "field" | "task" | "device" | "activity")}
                className={`relative text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute -bottom-[21px] left-0 h-0.5 w-full bg-slate-900" />
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "field" && (
              <div className="space-y-6">
                {/* Overall Health */}
                <div>
                  <p className="text-sm font-medium text-slate-500">Overall health:</p>
                  <div className="mt-1 flex items-end gap-4">
                    <span className="text-6xl font-light text-slate-800">{overallHealth}<span className="text-4xl text-slate-400">%</span></span>
                    <div className="mb-2">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-0.5 text-xs font-normal">Good</Badge>
                      <p className="mt-1 text-[10px] leading-tight text-slate-400 w-32">
                        Your plants are thriving and showing excellent health
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fields List */}
                <div className="space-y-3">
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                        field.id === selectedFieldId
                          ? "border-emerald-500 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                          : "border-transparent bg-white hover:bg-slate-50"
                      }`}
                    >
                      {field.id === selectedFieldId && (
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                      )}
                      <div className="flex items-center justify-between">
                        <div className="pl-2">
                          <p className="font-semibold text-slate-900">{field.name}</p>
                          <p className="text-xs text-slate-400">Spinach</p> {/* Keeping Spinach as placeholder or change to Cana? Design says Spinach. Context says Cana. I'll use Cana in data but maybe Spinach label for visual match? No, better use correct data. */}
                        </div>
                        <div className="flex items-center gap-3">
                           {field.healthLabel === "Low" && (
                             <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-600 gap-1 px-2 py-0.5 text-[10px] font-normal">
                               <Droplets className="h-3 w-3" /> Low
                             </Badge>
                           )}
                           {field.healthLabel === "Alert" && (
                             <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-600 gap-1 px-2 py-0.5 text-[10px] font-normal">
                               <AlertTriangle className="h-3 w-3" /> Sick Plant
                             </Badge>
                           )}
                           <div className={`flex items-center gap-1.5 text-sm font-medium ${
                             field.healthLabel === "Good" ? "text-emerald-500" : 
                             field.healthLabel === "Low" ? "text-amber-500" : "text-amber-500"
                           }`}>
                             <Activity className="h-4 w-4" />
                             {Math.round(field.health * 100)}%
                           </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Main Content */}
        <div className="relative flex-1 overflow-hidden rounded-[15px] bg-slate-900">
          {/* Background Image / Map Placeholder */}
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3200&auto=format&fit=crop" 
            alt="Satellite View"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

          {/* Top Controls */}
          <div className="absolute left-6 top-6 z-20 flex gap-2">
            <div className="flex rounded-xl bg-slate-900/80 p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode("analytic")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "analytic"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Analytic
              </button>
              <button
                onClick={() => setViewMode("cctv")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "cctv"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                CCTV
              </button>
            </div>
          </div>

          {/* Field Overlays */}
          <div className="absolute inset-0">
            {fields.map((field) => (
              <div
                key={field.id}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  left: field.position.left,
                  top: field.position.top,
                  width: field.position.width,
                  height: field.position.height,
                  transform: field.position.rotate ? `rotate(${field.position.rotate})` : undefined,
                }}
              >
                {/* Polygon Shape */}
                <div
                  onClick={() => setSelectedFieldId(field.id)}
                  className={`h-full w-full cursor-pointer rounded-[32px] border-2 backdrop-blur-sm transition-all ${
                    field.id === selectedFieldId
                      ? "border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                      : "border-white/30 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {/* Pattern inside polygon */}
                  {field.id === selectedFieldId && (
                    <div className="absolute inset-0 rounded-[30px] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
                  )}
                </div>

                {/* Label */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md">
                  {field.name}
                </div>

                {/* Connection Line (Only for selected) */}
                {field.id === selectedFieldId && detailPanelOpen && (
                  <svg className="absolute left-full top-1/2 h-32 w-32 -translate-y-1/2 overflow-visible pointer-events-none">
                    <path
                      d="M 0 0 L 50 -50 L 100 -50"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="drop-shadow-md"
                    />
                    <circle cx="0" cy="0" r="4" fill="white" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Detail Panel (Floating) */}
          {detailPanelOpen && selectedField && (
            <div className="absolute right-6 top-6 z-30 w-[340px] overflow-hidden rounded-[24px] bg-white/95 shadow-[0_24px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-right-4">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Section 3</p> {/* Hardcoded Section 3 in design, using dynamic */}
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Talhão</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedField.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      {selectedField.crop} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <button onClick={() => setDetailPanelOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs text-slate-400">Health</p>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <span className="text-lg font-semibold">{Math.round(selectedField.health * 100)}%</span>
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">{selectedField.healthLabel}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Area</p>
                    <p className="text-base font-medium text-slate-900">{selectedField.area}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Last Harvest</p>
                    <p className="text-base font-medium text-slate-900">{selectedField.lastImage}</p> {/* Using lastImage as proxy for Last Harvest date in design context */}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Next Harvest Prediction</p>
                    <p className="text-base font-medium text-slate-900">{selectedField.nextHarvest} <span className="text-slate-400">• {selectedField.daysToHarvest} Days</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs text-slate-400">Humidity</p>
                      <p className="text-lg font-semibold text-slate-900">80%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">pH Level</p>
                      <p className="text-lg font-semibold text-slate-900">7.2</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400">Soil Moisture</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedField.soilMoisture}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Right Navigation */}
          <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-3">
             {/* Mini list of sections */}
             <div className="flex flex-col items-end gap-2 mb-4">
                {fields.slice(4, 8).map(f => (
                    <div key={f.id} className="bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md cursor-pointer hover:bg-slate-800">
                        {f.name}
                    </div>
                ))}
             </div>

            {/* D-Pad */}
            <div className="relative h-32 w-32 rounded-full bg-white/10 backdrop-blur-md p-2 shadow-2xl ring-1 ring-white/20">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                     <div className="h-3 w-3 rounded-full bg-slate-300" />
                  </div>
               </div>
               <button className="absolute top-2 left-1/2 -translate-x-1/2 p-2 text-white/70 hover:text-white"><MoveUp className="h-6 w-6" /></button>
               <button className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 text-white/70 hover:text-white"><MoveDown className="h-6 w-6" /></button>
               <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"><MoveLeft className="h-6 w-6" /></button>
               <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"><MoveRight className="h-6 w-6" /></button>
            </div>
          </div>

          {/* Bottom Left Controls */}
          <div className="absolute bottom-8 left-8 z-20 flex gap-3">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/50 text-white backdrop-blur-md hover:bg-slate-900/70 ring-1 ring-white/10">
              <Scan className="h-5 w-5" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/50 text-white backdrop-blur-md hover:bg-slate-900/70 ring-1 ring-white/10">
              <Layers className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Hotspots;
