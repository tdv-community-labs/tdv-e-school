import React, { useRef, useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const WhiteboardView = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Yüksək rezolyusiya (Retina) dəstəyi
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = 600; // Sabit hündürlük
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#09090b'; // Kömür rəngi fon (Qara lövhə tərzində)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    e.preventDefault(); // Mobil ekranda sürüşmənin qarşısını al

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#09090b' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 5 : lineWidth;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!confirm('Lövhəni tamamilə silmək istədiyinizə əminsiniz?')) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'tdv-lovhe-qeydi.png';
    link.href = dataUrl;
    link.click();
  };

  return html`
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 animate-fadeIn pb-16">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Real-vaxt Dərs Aləti</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">İnteraktiv Qara Lövhə</h1>
          <p className="text-zinc-500 mt-2">Düsturları yazın, sxemlər çəkin və nəticəni şəkil olaraq yaddaşda saxlayın.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-zinc-900 p-2 sm:p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
            <button 
              onClick=\${() => setTool('pen')}
              className=\`w-10 h-10 rounded-lg flex items-center justify-center transition-all \${tool === 'pen' ? 'bg-white dark:bg-zinc-800 shadow-sm text-cyan-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}\`
              title="Qələm"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
            <button 
              onClick=\${() => setTool('eraser')}
              className=\`w-10 h-10 rounded-lg flex items-center justify-center transition-all \${tool === 'eraser' ? 'bg-white dark:bg-zinc-800 shadow-sm text-rose-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}\`
              title="Pozan"
            >
              <i className="fa-solid fa-eraser"></i>
            </button>
          </div>

          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          <div className="flex items-center gap-2 px-2">
            \${['#ffffff', '#fbbf24', '#34d399', '#60a5fa', '#f43f5e'].map(c => html\`
              <button 
                key=\${c}
                onClick=\${() => { setColor(c); setTool('pen'); }}
                className=\`w-6 h-6 rounded-full border-2 transition-transform \${color === c && tool === 'pen' ? 'scale-125 border-zinc-400 dark:border-zinc-500' : 'border-transparent hover:scale-110'}\`
                style=\${{ backgroundColor: c }}
              ></button>
            \`)}
          </div>

          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          <button 
            onClick=\${clearBoard}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-trash-can"></i> Sil
          </button>
          
          <button 
            onClick=\${saveBoard}
            className="px-4 py-2 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md rounded-xl transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i> Yadda saxla
          </button>
        </div>
      </div>

      <div className="w-full bg-[#09090b] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#27272a] relative touch-none cursor-crosshair">
        <div className="absolute bottom-2 right-4 text-zinc-700/50 font-mono text-[10px] uppercase pointer-events-none tracking-widest">
          TDV Smart Board v1.0
        </div>
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <canvas
          ref=\${canvasRef}
          onMouseDown=\${startDrawing}
          onMouseMove=\${draw}
          onMouseUp=\${stopDrawing}
          onMouseLeave=\${stopDrawing}
          onTouchStart=\${startDrawing}
          onTouchMove=\${draw}
          onTouchEnd=\${stopDrawing}
          className="w-full block"
        ></canvas>
      </div>

    </div>
  `;
};
