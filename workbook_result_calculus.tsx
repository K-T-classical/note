import React, { useState, useEffect } from 'react';
import { Save, Printer, RefreshCw, TrendingUp, ArrowRight, Calculator, Calendar } from 'lucide-react';

const CalculusWorkbook = () => {
  // ------------------------------------------------------------
  // 1. State Definition (状態の定義)
  // ------------------------------------------------------------
  const [inputs, setInputs] = useState({
    currentStatus: '',      // 初期値 T0
    idealStatus: '',        // 理想の結果 T
    currentAction: '',      // 行動 Action(t)
    actionFrequency: '',    // 頻度 dt
    actionUnit: '回',       // 単位
    isIdealReachable: null, // 到達判定
    newAction: '',          // 修正行動 Action'(t)
    weeklyLog: Array(7).fill(''), // 短期積分ログ
  });

  const [isSaved, setIsSaved] = useState(false);

  // ------------------------------------------------------------
  // 2. Effects (副作用: データの読み込みと保存)
  // ------------------------------------------------------------
  // 初回ロード時にLocalStorageからデータを読み込む
  useEffect(() => {
    const saved = localStorage.getItem('calculus_workbook_data');
    if (saved) {
      setInputs(JSON.parse(saved));
    }
  }, []);

  // 保存ボタンのアクション
  const saveData = () => {
    localStorage.setItem('calculus_workbook_data', JSON.stringify(inputs));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // 入力ハンドラー
  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleWeeklyLogChange = (index, value) => {
    const newLog = [...inputs.weeklyLog];
    newLog[index] = value;
    setInputs(prev => ({ ...prev, weeklyLog: newLog }));
  };

  // ------------------------------------------------------------
  // 3. Logic (計算ロジック)
  // ------------------------------------------------------------
  const calculateProjection = () => {
    const freq = parseFloat(inputs.actionFrequency);
    if (!isNaN(freq) && inputs.actionUnit) {
      const yearly = freq * 52; 
      return (
        <span className="font-bold text-blue-700">
          １年間で {yearly.toLocaleString()} {inputs.actionUnit}
        </span>
      );
    }
    return <span className="text-slate-400">数値を入力すると計算されます</span>;
  };

  // ------------------------------------------------------------
  // 4. UI Rendering (見た目の構築)
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 print:bg-white">
      
      {/* Header Area */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-700" />
            <h1 className="text-lg font-bold text-slate-900">成果の微積分<span className="text-slate-500 text-sm font-normal ml-2">実践ワークブック</span></h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={saveData} 
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all ${isSaved ? 'bg-green-100 text-green-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isSaved ? '保存完了' : <><Save className="w-4 h-4" /> 保存</>}
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" /> PDF化 / 印刷
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 print:px-0 print:py-0">
        
        {/* Concept Card */}
        <section className="mb-10 bg-white p-8 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-6 font-sans">成果から解放されるための実践ワークブック</h2>
            <p className="text-slate-500 text-ms">成果は積分。行動と運は微分。</p>
          </div>
          <p className="text-xs text-slate-400 text-center print:hidden">
            ※ このページに入力した内容はブラウザに自動保存されます。
          </p>
        </section>

        {/* Step 1: Initialization */}
        <div className="space-y-8 print:space-y-6">
          <div className="grid md:grid-cols-2 gap-6 print:block">
            {/* T0 */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-slate-300 print:mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">STEP 1</span>
                <h3 className="font-bold text-slate-800">初期値</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">現在の成果。</p>
              <textarea
                value={inputs.currentStatus}
                onChange={(e) => handleChange('currentStatus', e.target.value)}
                placeholder="例：大学院生、貯金〇〇円、プログラミングスキル..."
                className="w-full h-24 p-3 text-sm border-slate-200 rounded-md bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </section>

            {/* T */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-slate-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">STEP 2</span>
                <h3 className="font-bold text-slate-800">積分値</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">未来の成果。</p>
              <textarea
                value={inputs.idealStatus}
                onChange={(e) => handleChange('idealStatus', e.target.value)}
                placeholder="例：noteで月1万PV、博士課程進学..."
                className="w-full h-24 p-3 text-sm border-slate-200 rounded-md bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </section>
          </div>

          {/* Step 3: Simulation */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-slate-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">STEP 3</span>
              <h3 className="font-bold text-slate-800">仮想積分シミュレーション</h3>
            </div>
            
            <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 mb-6 print:bg-white print:border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">今の行動</label>
                  <input
                    type="text"
                    value={inputs.currentAction}
                    onChange={(e) => handleChange('currentAction', e.target.value)}
                    placeholder="例：note執筆"
                    className="w-full p-2 text-sm border-slate-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">頻度（週あたり）</label>
                  <input
                    type="number"
                    value={inputs.actionFrequency}
                    onChange={(e) => handleChange('actionFrequency', e.target.value)}
                    placeholder="1"
                    className="w-full p-2 text-sm border-slate-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">単位</label>
                  <select
                    value={inputs.actionUnit}
                    onChange={(e) => handleChange('actionUnit', e.target.value)}
                    className="w-full p-2 text-sm border-slate-300 rounded focus:ring-blue-500"
                  >
                    <option value="時間">時間</option>
                    <option value="回">回</option>
                    <option value="ページ">ページ</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded text-sm print:border-slate-300">
                <Calculator className="w-4 h-4 text-blue-500" />
                積分結果予測： {calculateProjection()} の積み上げ
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">Q. 上記の計算結果は、理想の未来に届きそうですか？</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${inputs.isIdealReachable === 'yes' ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                  <input
                    type="radio"
                    name="reachability"
                    checked={inputs.isIdealReachable === 'yes'}
                    onChange={() => handleChange('isIdealReachable', 'yes')}
                    className="text-blue-600"
                  />
                  <span className="text-sm">十分到達できそうだ</span>
                </label>
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${inputs.isIdealReachable === 'no' ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                  <input
                    type="radio"
                    name="reachability"
                    checked={inputs.isIdealReachable === 'no'}
                    onChange={() => handleChange('isIdealReachable', 'no')}
                    className="text-blue-600"
                  />
                  <span className="text-sm">足りない / 方向が違う</span>
                </label>
              </div>
            </div>

            {inputs.isIdealReachable === 'yes' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">微係数の維持</label>
                <p className="text-sm text-slate-500 mb-2">成果へのベクトルが正しいようです。</p>
              </div>
            )}

            {inputs.isIdealReachable === 'no' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">微係数の修正（アクションプラン）</label>
                <p className="text-sm text-slate-500 mb-2">一発逆転ではなく、行動の「角度」や「量」を現実的に調整します。</p>
                <input
                  type="text"
                  value={inputs.newAction}
                  onChange={(e) => handleChange('newAction', e.target.value)}
                  placeholder="例：週1回の更新を週2回にする / 内容を専門的なものに変える..."
                  className="w-full p-2 text-sm border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            )}
          </section>

          {/* Step 4: Micro-Integration */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-slate-300 print:break-inside-avoid">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">STEP 4</span>
              <h3 className="font-bold text-slate-800">短期積分の記録</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              「成果」は忘れてこの１週間の成長を記録しましょう。
            </p>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="flex flex-col">
                  <div className="text-[10px] font-bold text-slate-400 text-center mb-1 uppercase tracking-wider">{day}</div>
                  <div className="relative aspect-[3/4] md:aspect-square border border-slate-200 rounded hover:border-blue-400 transition-colors bg-white group">
                    <textarea
                      value={inputs.weeklyLog[index]}
                      onChange={(e) => handleWeeklyLogChange(index, e.target.value)}
                      className="w-full h-full p-1 text-[10px] md:text-xs resize-none focus:outline-none focus:bg-blue-50/30 text-center flex items-center justify-center pt-2 md:pt-4"
                    />
                    {inputs.weeklyLog[index] && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center print:mt-12">
              <p className="text-sm text-slate-600 font-serif italic">
                "Natura non facit saltus."
              </p>
              <p className="text-sm text-slate-400 mt-1">
                自然は跳躍しない。あなたの成長もまた連続的である。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CalculusWorkbook;
