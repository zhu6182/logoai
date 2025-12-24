
import React, { useState } from 'react';
import { generateLogo, editLogo } from './services/geminiService';
import { GeneratedLogo } from './types';
import LogoCard from './components/LogoCard';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [logos, setLogos] = useState<GeneratedLogo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI 状态
  const [previewLogo, setPreviewLogo] = useState<GeneratedLogo | null>(null);
  const [editingLogo, setEditingLogo] = useState<GeneratedLogo | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!companyName || !philosophy) {
      setError("请输入公司名称和经营理念。");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setLogos([]); // 清除旧结果

    try {
      // 同时生成 10 个不同的方案
      const logoPromises = Array.from({ length: 10 }).map((_, i) => 
        generateLogo(companyName, philosophy, i)
      );

      const results = await Promise.all(logoPromises);
      
      const newLogos: GeneratedLogo[] = results.map((url, index) => ({
        id: `logo-${Date.now()}-${index}`,
        url,
        prompt: `${companyName} - ${philosophy}`
      }));

      setLogos(newLogos);
    } catch (err: any) {
      setError(err.message || "生成过程中发生错误。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!editingLogo || !editPrompt) return;

    setIsEditing(true);
    try {
      const editedUrl = await editLogo(editingLogo.url, editPrompt);
      const updatedLogo = { ...editingLogo, url: editedUrl, id: `logo-edit-${Date.now()}` };
      
      // 更新列表中的对应项目
      setLogos(prev => prev.map(l => l.id === editingLogo.id ? updatedLogo : l));
      setEditingLogo(updatedLogo);
      setEditPrompt('');
    } catch (err: any) {
      alert("编辑失败: " + err.message);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100">
      {/* 顶部导航与输入区 */}
      <header className="glass sticky top-0 z-40 border-b border-gray-200 py-6 px-4 mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 00.457-3c0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.921.54 3.715 1.478 5.232l.457.912" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">LogoAI</h1>
              <span className="text-xs text-indigo-600 font-medium tracking-widest uppercase">品牌设计师</span>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-end gap-4 w-full md:w-auto">
            <div className="flex-1 min-w-[200px] w-full">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-wider">公司名称</label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例如：星辰科技"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                disabled={isGenerating}
              />
            </div>
            <div className="flex-1 min-w-[280px] w-full">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-wider">经营理念 / 愿景</label>
              <input 
                type="text" 
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="例如：极简主义、未来感、可持续发展"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                disabled={isGenerating}
              />
            </div>
            <button 
              type="submit"
              disabled={isGenerating}
              className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-indigo-500/30 ${isGenerating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在创作中...
                </span>
              ) : logos.length > 0 ? '重新生成 10 个方案' : '生成 Logo'}
            </button>
          </form>
        </div>
      </header>

      {/* 主展示区 */}
      <main className="max-w-7xl mx-auto px-4">
        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!isGenerating && logos.length === 0 && !error && (
          <div className="text-center py-32 flex flex-col items-center">
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">准备好设计您的品牌视觉了</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-lg">在上方输入公司信息，AI 将为您量身打造 10 个专业的 Logo 方案，每一个都蕴含您的独特经营理念。</p>
          </div>
        )}

        {isGenerating && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ))}
          </div>
        )}

        {logos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {logos.map((logo) => (
              <LogoCard 
                key={logo.id} 
                url={logo.url} 
                onClick={() => setPreviewLogo(logo)} 
                onEdit={() => {
                  setEditingLogo(logo);
                  setEditPrompt('');
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* 预览模态框 */}
      <Modal 
        isOpen={!!previewLogo} 
        onClose={() => setPreviewLogo(null)}
        title="Logo 预览"
      >
        <div className="flex flex-col items-center">
          <div className="bg-white p-8 sm:p-16 rounded-3xl mb-8 w-full max-w-2xl border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-center">
            <img src={previewLogo?.url} alt="Logo 预览" className="max-w-full h-auto object-contain rounded-xl" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = previewLogo?.url || '';
                link.download = `${companyName || 'logo'}-设计方案.png`;
                link.click();
              }}
              className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              下载素材 (PNG)
            </button>
            <button 
              onClick={() => {
                setEditingLogo(previewLogo);
                setPreviewLogo(null);
              }}
              className="px-10 py-4 bg-white border-2 border-indigo-50 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all active:scale-95"
            >
              AI 二次编辑
            </button>
          </div>
        </div>
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        isOpen={!!editingLogo}
        onClose={() => {
          if (!isEditing) setEditingLogo(null);
        }}
        title="AI Logo 编辑器"
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center p-8">
              <img 
                src={editingLogo?.url} 
                alt="原始设计" 
                className={`max-w-full max-h-full object-contain ${isEditing ? 'opacity-50 blur-sm' : ''} transition-all duration-500`} 
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="text-indigo-700 font-bold bg-white/90 px-4 py-1.5 rounded-full shadow-lg">正在重新构思...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">当前目标资产</p>
              <p className="text-sm text-gray-600 italic leading-relaxed">{editingLogo?.prompt}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">描述您的修改需求</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">告诉 AI 您想如何调整这个 Logo。例如：“增加色彩”、“添加复古光泽”或“使用未来感字体”。</p>
              <textarea 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="在此输入您的修改建议..."
                className="w-full h-40 p-5 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all shadow-inner text-gray-700"
                disabled={isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "复古滤镜", prompt: "Add a retro vintage filter and aged texture" },
                { label: "霓虹风格", prompt: "Make it look like a vibrant neon sign with glow" },
                { label: "极简扁平", prompt: "Apply a modern flat design minimalist style" },
                { label: "黄金比例", prompt: "Refine lines using golden ratio geometry" }
              ].map((hint) => (
                <button 
                  key={hint.label}
                  onClick={() => setEditPrompt(hint.prompt)}
                  className="text-xs font-bold py-2.5 px-4 bg-white hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all shadow-sm"
                >
                  {hint.label}
                </button>
              ))}
            </div>

            <button 
              onClick={handleEdit}
              disabled={isEditing || !editPrompt}
              className={`w-full py-5 rounded-2xl font-black text-lg text-white transition-all transform ${isEditing || !editPrompt ? 'bg-indigo-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 active:scale-[0.98]'}`}
            >
              应用 AI 转换
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
