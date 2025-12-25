import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  ChevronRight, 
  Zap,
  LayoutDashboard,
  Target,
  BadgeDollarSign,
  ArrowUpRight,
  Wallet,
  ShoppingCart,
  MapPin,
  Info,
  LineChart as LineChartIcon,
  DollarSign
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  Line,
  ComposedChart
} from 'recharts';

const apiKey = "";

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [view, setView] = useState('strategy');

  const systemPrompt = `Eres "R7 IA". Tu misión es dar análisis de rentabilidad exactos en color verde.
  
  REGLAS DE RESPUESTA PARA UN SOLO PRODUCTO:
  1. Identifica el precio promedio en el mercado actual del país.
  2. Define el precio de venta sugerido para ser competitivo y rentable.
  3. Calcula la ganancia neta por unidad vendida.
  
  REGLAS PARA VARIOS PRODUCTOS:
  1. Indica capital total necesario, qué productos específicos comprar y la distribución del presupuesto.

  REGLAS DE FORMATO:
  - Escribe exclusivamente en PÁRRAFOS DE TEXTO PLANO. 
  - NO uses asteriscos (*), guiones (-), negritas o listas. Solo texto corrido profesional.
  - Al final de tu texto, antes del JSON, escribe un párrafo que empiece con "INTERPRETACIÓN GRÁFICA:" detallando lo que dicen las métricas.

  JSON_START
  {
    "type": "single",
    "market_price": 0,
    "sale_price": 0,
    "profit": 0,
    "monthly_projection": [{"name": "Mes 1", "income": 1000, "profit": 200}, {"name": "Mes 2", "income": 2800, "profit": 800}, {"name": "Mes 3", "income": 5000, "profit": 1500}, {"name": "Mes 4", "income": 8500, "profit": 2800}],
    "products": [],
    "roi_total": "0%"
  }
  JSON_END`;

  const processResponse = (text) => {
    const jsonMatch = text.match(/JSON_START([\s\S]*?)JSON_END/);
    let cleanText = text.replace(/JSON_START([\s\S]*?)JSON_END/, "").trim();
    
    const interpretationSplit = cleanText.split("INTERPRETACIÓN GRÁFICA:");
    const strategyText = interpretationSplit[0].replace(/[*_#\-•]/g, "").trim();
    const graphInterpretation = interpretationSplit[1] ? interpretationSplit[1].replace(/[*_#\-•]/g, "").trim() : "";

    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        setFinancialData({ ...data, graphInterpretation });
      } catch (e) {
        console.error("Error parsing JSON", e);
      }
    }
    setAnalysis(strategyText);
  };

  const generateBusinessPlan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnalysis(null);
    setFinancialData(null);
    setView('strategy');

    const payload = {
      contents: [{ parts: [{ text: input }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) processResponse(text);
    } catch (error) {
      setAnalysis("Error en la conexión con la red neuronal de R7 IA.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#059669', '#34d399', '#064e3b', '#6ee7b7'];

  return (
    <div className="min-h-screen bg-[#050706] text-slate-400 font-sans selection:bg-emerald-500/30">
      {/* Emerald Header */}
      <nav className="border-b border-emerald-500/10 bg-[#050706]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap size={20} className="text-black fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-white text-lg leading-none uppercase">R7 IA</span>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.4em]">Arbitraje & Capital</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Market Alive</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Terminal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b0e0c] border border-emerald-500/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BadgeDollarSign size={100} className="text-emerald-500" />
            </div>
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Target size={14} /> Inteligencia de Mercado
            </h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Cuánto cuesta un producto X y a cuánto venderlo? o ¿En qué invertir mi capital?"
              className="w-full h-48 bg-black/40 border border-emerald-500/10 rounded-xl p-4 text-sm text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all resize-none placeholder:text-slate-700 leading-relaxed"
            />
            <button
              onClick={generateBusinessPlan}
              disabled={loading || !input.trim()}
              className="w-full mt-4 bg-emerald-500 text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-20"
            >
              {loading ? "Calculando Algoritmos..." : "Ejecutar Diagnóstico"}
            </button>
          </div>

          {financialData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              {financialData.type === 'single' ? (
                <>
                  <div className="bg-[#0b0e0c] border-l-4 border-emerald-500 p-5 rounded-r-xl">
                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Mercado Actual</div>
                    <div className="text-2xl font-black text-white">${financialData.market_price}</div>
                  </div>
                  <div className="bg-[#0b0e0c] border-l-4 border-emerald-500 p-5 rounded-r-xl">
                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Precio de Venta</div>
                    <div className="text-2xl font-black text-white">${financialData.sale_price}</div>
                  </div>
                  <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-5 rounded-r-xl">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase mb-1">Beneficio Neto</div>
                    <div className="text-2xl font-black text-emerald-400">${financialData.profit}</div>
                  </div>
                </>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Retorno de Inversión</div>
                  <div className="text-4xl font-black text-white">{financialData.roi_total}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Intelligence Display */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0b0e0c] border border-emerald-500/10 rounded-2xl overflow-hidden flex flex-col min-h-[550px] shadow-2xl">
            <div className="flex bg-black/40 border-b border-emerald-500/10 p-1">
              <button 
                onClick={() => setView('strategy')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all ${view === 'strategy' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Estrategia Pura
              </button>
              <button 
                onClick={() => setView('projections')}
                disabled={!financialData}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all ${view === 'projections' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-600 hover:text-slate-400 disabled:opacity-0'}`}
              >
                Métricas R7
              </button>
            </div>

            <div className="p-8 flex-1">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.5em] animate-pulse">Sincronizando Precios</span>
                </div>
              ) : analysis ? (
                <div className="animate-in fade-in duration-700">
                  {view === 'strategy' ? (
                    <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
                      {analysis.split('\n').filter(p => p.trim()).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-10">
                      <div className="bg-black/40 p-6 rounded-2xl border border-emerald-500/5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                          <LineChartIcon size={14} className="text-emerald-500" /> Proyección de Escalabilidad
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={financialData.monthly_projection || financialData.products.map(p => ({name: p.name, income: p.investment}))}>
                              <defs>
                                <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.6}/>
                                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                              <YAxis hide />
                              <Tooltip contentStyle={{ backgroundColor: '#0b0e0c', border: '1px solid #10b98120', borderRadius: '12px' }} />
                              <Bar dataKey="income" fill="url(#barGreen)" radius={[6, 6, 0, 0]} />
                              <Line type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={3} dot={{fill: '#34d399', r: 4}} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {financialData.graphInterpretation && (
                        <div className="bg-emerald-500/5 border-l-2 border-emerald-500 p-6 rounded-r-xl">
                          <div className="flex items-start gap-4">
                            <Info className="text-emerald-400 shrink-0 mt-1" size={18} />
                            <p className="text-slate-400 text-sm leading-relaxed italic">
                              {financialData.graphInterpretation}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {financialData.type === 'multiple' && financialData.products.map((p, i) => (
                          <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-[8px] text-slate-500 uppercase font-bold mb-1 truncate">{p.name}</div>
                            <div className="text-base font-black text-white">${p.investment}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <div className="w-24 h-24 border-2 border-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <DollarSign size={40} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Standby for Data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
