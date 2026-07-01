import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { db } from './db';
import { User, Activity, Trophy, History, ArrowLeft, Fingerprint, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fingerNames = ['Kleiner', 'Ring', 'Mittel', 'Zeige', 'Daumen', 'Daumen', 'Zeige', 'Mittel', 'Ring', 'Kleiner'];

const FingerCircle = ({ index, value, peak, colorClass, highlight = false, hideValues = false }) => {
    const intensity = Math.min(value / 50, 100);

    return (
        <div
            className={`flex flex-col items-center gap-2 transition-all duration-20 ${highlight ? 'scale-110' : 'opacity-60'}`}
        >
            {!hideValues && peak > 0 && (
                <div className="text-xs md:text-sm font-mono font-bold text-white mb-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-white/10">
                    {peak}g
                </div>
            )}
            <div
                className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center relative overflow-hidden transition-all duration-20 ${highlight ? 'border-yellow-400 bg-yellow-500/40 shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-pulse' : 'border-white/20 bg-slate-800/30'}`}
            >
                <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-20 ${highlight ? 'bg-yellow-400 opacity-90' : `opacity-20 ${index < 5 ? 'bg-blue-500' : 'bg-purple-500'}`}`}
                    style={{ height: highlight ? '100%' : (hideValues ? '0%' : `${intensity}%`) }}
                ></div>
                <div className="z-10 flex flex-col items-center justify-center text-center bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10 w-[90%]">
                    {!hideValues && <span className="text-sm md:text-xl font-black font-mono text-white leading-none drop-shadow-md">{value}g</span>}
                    <span className={`text-[8px] md:text-[10px] uppercase font-black tracking-tighter ${highlight ? 'text-yellow-400' : 'text-slate-300'} ${hideValues ? '' : 'mt-1'}`}>{fingerNames[index]}</span>
                </div>
            </div>
        </div>
    );
};

const FingerBar = ({ index, value, peak, colorClass, highlight = false }) => (
    <div className={`flex flex-col items-center gap-2 group relative w-16 transition-all duration-20 ${highlight ? 'scale-110' : ''}`}>
        <div className={`text-3xs font-bold uppercase text-center h-8 flex items-center justify-center leading-tight transition-colors ${highlight ? 'text-green-400' : 'text-slate-500'}`}>
            {fingerNames[index]}
        </div>
        <div className={`relative w-10 h-64 rounded-xl overflow-hidden border transition-all duration-20 ${highlight ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-900/50 border-white/5'}`}>
            <div
                className="absolute left-0 right-0 h-0.5 bg-white/40 z-10 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                style={{ bottom: `${Math.min(peak / 50, 99.5)}%` }}
            >
                <div className="absolute -right-1 -top-2 text-[9px] font-mono text-white/50">{peak}g</div>
            </div>

            <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-20 ${highlight ? 'bg-green-500' : colorClass}`}
                style={{ height: `${Math.min(value / 50, 100)}%` }}
            >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
        </div>
        <div className={`font-mono text-sm font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}g</div>
    </div>
);

const CustomXAxisTick = ({ x, y, payload }) => {
    if (!payload || !payload.value) return null;
    const parts = payload.value.split('\n');
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={12} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={600} className="uppercase">
                {parts[0]}
            </text>
            <text x={0} y={26} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800} className="font-mono">
                {parts[1]}
            </text>
        </g>
    );
};

const MenuView = ({ setCurrentView }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
        <button
            onClick={(e) => { e.currentTarget.blur(); setCurrentView('analysis'); }}
            className="glass p-10 flex flex-col items-center gap-6 hover:bg-white/10 transition-all group cursor-pointer"
        >
            <div className="bg-blue-500/20 p-6 rounded-3xl group-hover:scale-110 transition-transform">
                <Activity size={48} className="text-blue-400" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Live-Analyse</h3>
                <p className="text-slate-400 text-sm">Echtzeit Kraftmessung aller Finger</p>
            </div>
        </button>

        <button
            onClick={(e) => { e.currentTarget.blur(); setCurrentView('game'); }}
            className="glass p-10 flex flex-col items-center gap-6 hover:bg-white/10 transition-all group cursor-pointer"
        >
            <div className="bg-green-500/20 p-6 rounded-3xl group-hover:scale-110 transition-transform">
                <Trophy size={48} className="text-green-400" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Reaktionstest</h3>
                <p className="text-slate-400 text-sm">Teste deine Reflexe und Fingerkraft</p>
            </div>
        </button>

        <button
            onClick={(e) => { e.currentTarget.blur(); setCurrentView('about'); }}
            className="glass p-10 flex flex-col items-center gap-6 hover:bg-white/10 transition-all group cursor-pointer"
        >
            <div className="bg-purple-500/20 p-6 rounded-3xl group-hover:scale-110 transition-transform">
                <BarChart3 size={48} className="text-purple-400" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Über Uns</h3>
                <p className="text-slate-400 text-sm">Informationen zum Dactylus Projekt</p>
            </div>
        </button>
    </div>
);

const AboutUs = ({ setCurrentView }) => {
    const team = [
        { name: "WALTER Christian", role: "Projektauftraggeber", desc: "Betreuer und Auftraggeber der Diplomarbeit.", img: "/f1.jpg", color: "text-red-400" },
        { name: "OBRADOVIC Stefan", role: "Projektleiter", desc: "Fokus auf Projektmanagement und Leiterplatten Fertigung.", img: "/image.3.jpg", color: "text-blue-400" },
        { name: "AL SAEED Ibrahim", role: "Hardware & Design", desc: "Zuständig für das Layout und Leiterplatten Fertigung.", img: "/image.4.jpg", color: "text-green-400" },
        { name: "ALI Ahmad", role: "Software & Sensoren", desc: "Spezialisierung auf Programmierung, Web-App und Sensoren.", img: "/image.2.jpg", color: "text-purple-400" },
        { name: "FRIEDL David", role: "Gehäuse Design", desc: "Zuständig für das Gehäuse Design und 3D-Modellierung.", img: "/image.5.jpg", color: "text-yellow-400" }
    ];

    const MemberCard = ({ member }) => (
        <div className={`group glass p-5 flex flex-col items-center hover:bg-white/10 transition-all duration-20 border-white/5 h-full`}>
            <div className="relative mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 relative z-10 mx-auto">
                    <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-20"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + member.name.replace(' ', '+') + "&background=0D1117&color=fff"; }}
                    />
                </div>
            </div>
            <h4 className="font-bold text-center text-base leading-tight mb-1 min-h-[2.5rem] flex items-center">{member.name}</h4>
            <span className={`text-[9px] font-black uppercase tracking-widest ${member.color} mb-3`}>{member.role}</span>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">{member.desc}</p>
        </div>
    );

    return (
        <div className="glass p-12 max-w-[95rem] mx-auto space-y-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-white">DACTYLUS</h2>
                    <p className="text-slate-400 mt-2">Diplomarbeit 2026 • HTL WIEN 10 / 5AAELI</p>
                </div>
                <button onClick={() => setCurrentView('menu')} className="bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
                    <ArrowLeft size={18} /> Zurück zum Menü
                </button>
            </div>

            <div className="flex flex-row flex-nowrap gap-4 pt-6 overflow-x-auto pb-4 custom-scrollbar">
                {team.map((member, idx) => (
                    <div key={idx} className="min-w-[220px] flex-1">
                        <MemberCard member={member} />
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-white/5">
                <div className="glass p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                    <h5 className="text-slate-500 font-mono text-[9px] uppercase tracking-[0.3em] mb-4 text-center">Besonderer Dank geht an</h5>
                    <div className="flex flex-wrap justify-center items-center" style={{ gap: '60px' }}>
                        {["Rajic-Cakalin", "Helmut Weiss", "Zatl Michael", "Wörndl Harald"].map((name, i) => (
                            <span key={i} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors" style={{ padding: '0 40px' }}>
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
                <span>Version 2.6.0</span>
                <span>© 2026 Dactylus Team</span>
            </div>
        </div>
    );
};

const ReactionGame = ({ data, peaks, setCurrentView, patient }) => {
    const [status, setStatus] = useState('bereit');
    const [target, setTarget] = useState(null);
    const [time, setTime] = useState(0);
    const [bestTimes, setBestTimes] = useState(new Array(10).fill(null));

    const lastDataRef = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const gameBeginTime = useRef(0);
    const signalStartTime = useRef(0);
    const timerRef = useRef(null);

    const GEWICHT_LIMIT = 250;
    const ANTI_SCHUMMEL_MS = 100;

    useEffect(() => {
        lastDataRef.current = data.values;
        checkGameLogic();
    }, [data]);

    useEffect(() => {
        const loadBests = async () => {
            if (!patient) return;
            const results = await db.reactionRecords.where('patientId').equals(patient.id).toArray();
            const bests = new Array(10).fill(null);
            results.forEach(r => {
                if (bests[r.fingerIndex] === null || r.reactionTime < bests[r.fingerIndex]) {
                    bests[r.fingerIndex] = r.reactionTime;
                }
            });
            setBestTimes(bests);
        };
        if (status === 'bereit' || status === 'erfolgreich' || status === 'abbruch') {
            loadBests();
        }
    }, [status, patient]);

    const checkGameLogic = () => {
        const currentData = lastDataRef.current;
        const maxVal = Math.max(...currentData);

        if (status === 'warten') {
            if (Date.now() - gameBeginTime.current < 500) return;
            if (maxVal > GEWICHT_LIMIT) {
                endGame('abbruch');
            }
        } else if (status === 'aktiv') {
            const val = currentData[target];
            if (val > GEWICHT_LIMIT) {
                const rawReaction = Math.round(performance.now() - signalStartTime.current);
                const LATENZ_OFFSET = 800;
                const reaction = Math.max(0, rawReaction - LATENZ_OFFSET);
                if (rawReaction < ANTI_SCHUMMEL_MS) {
                    endGame('abbruch');
                } else {
                    setTime(reaction);
                    endGame('erfolgreich', reaction);
                }
            }
        }
    };

    const startGame = () => {
        setStatus('warten');
        setTime(0);
        setTarget(null);
        gameBeginTime.current = Date.now();
        if (timerRef.current) clearTimeout(timerRef.current);

        const randomDelay = 2500 + Math.random() * 2500;

        timerRef.current = setTimeout(() => {
            setStatus(prev => {
                if (prev === 'warten') {
                    setTarget(Math.floor(Math.random() * 10));
                    signalStartTime.current = performance.now();
                    return 'aktiv';
                }
                return prev;
            });
        }, randomDelay);
    };

    const endGame = async (newStatus, finalTime = null) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus(newStatus);

        if (newStatus === 'erfolgreich' && finalTime !== null && target !== null && patient) {
            try {
                await db.reactionRecords.add({
                    patientId: patient.id,
                    fingerIndex: target,
                    reactionTime: finalTime,
                    timestamp: Date.now()
                });
            } catch (err) {
                console.error("Fehler beim Speichern:", err);
            }
        }
    };

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    return (
        <div className="glass p-8 max-w-[90rem] mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Trophy className="text-green-400" /> Reaktionstest
                </h2>
                <button onClick={() => setCurrentView('menu')} className="bg-slate-800 hover:bg-slate-700">
                    <ArrowLeft size={18} className="mr-2" /> Zurück
                </button>
            </div>

            <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-white/5 relative h-[380px] flex flex-col justify-center overflow-hidden">
                {status === 'bereit' && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Neuer Test starten?</h3>
                        <button onClick={startGame} className="px-16 py-5 text-2xl bg-green-600 hover:bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all transform hover:scale-105 active:scale-95 font-black uppercase tracking-widest">
                            Jetzt Starten
                        </button>
                    </div>
                )}

                {status === 'warten' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-4xl font-black text-yellow-400 animate-pulse uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Bereit halten...</h3>
                        <p className="text-slate-400 font-medium">Finger noch nicht drücken!</p>
                    </div>
                )}

                {status === 'aktiv' && (
                    <div className="space-y-6 animate-in zoom-in duration-75">
                        <h3 className="text-8xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]">DRÜCKEN!</h3>
                        <div className="bg-yellow-400/10 border-y border-yellow-400/20 py-4 px-12 inline-block">
                            <p className="text-yellow-400 text-2xl font-black uppercase tracking-[.4em]">
                                {target < 5 ? 'LINKE HAND' : 'RECHTE HAND'}: {fingerNames[target].toUpperCase()}
                            </p>
                        </div>
                    </div>
                )}

                {status === 'erfolgreich' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center">
                            <Trophy className="text-yellow-400 mb-4 animate-bounce" size={48} />
                            <h3 className="text-7xl font-black text-white tracking-tighter">{time} <span className="text-3xl text-slate-500">ms</span></h3>
                        </div>
                        <p className="text-green-400 font-black uppercase tracking-[0.3em] text-sm">Spitzen-Reaktion!</p>
                        <button onClick={startGame} className="bg-slate-800 hover:bg-slate-700 font-bold px-8 py-3 rounded-xl transition-colors">Nochmal testen</button>
                    </div>
                )}

                {status === 'abbruch' && (
                    <div className="space-y-6 animate-in shake duration-300">
                        <h3 className="text-5xl font-black text-red-500 uppercase tracking-tight">Fehlstart!</h3>
                        <p className="text-slate-400 font-medium">Du warst zu schnell.</p>
                        <button onClick={startGame} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 font-bold px-8 py-3 rounded-xl">Neuer Versuch</button>
                    </div>
                )}
            </div>

            <div className="bg-slate-900/40 rounded-3xl border border-white/5 p-8">
                <div className="flex justify-between items-center pt-10 px-12 overflow-x-auto pb-6 custom-scrollbar">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {[0, 3, 2, 1, 4].map(i => (
                            <div key={i} className="w-[120px] flex flex-col items-center gap-3 flex-shrink-0">
                                <FingerCircle
                                    index={i}
                                    value={data.values[i]}
                                    peak={peaks[i]}
                                    highlight={status === 'aktiv' && target === i}
                                    hideValues={true}
                                />
                                {bestTimes[i] !== null && (
                                    <div className="text-[11px] font-black font-mono tracking-tighter px-2 py-1 rounded border bg-green-500/10 text-green-400 border-green-500/20 whitespace-nowrap shadow-sm">
                                        BEST: {bestTimes[i]}ms
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        {[5, 6, 7, 8, 9].map(i => (
                            <div key={i} className="w-[120px] flex flex-col items-center gap-3 flex-shrink-0">
                                <FingerCircle
                                    index={i}
                                    value={data.values[i]}
                                    peak={peaks[i]}
                                    highlight={status === 'aktiv' && target === i}
                                    hideValues={true}
                                />
                                {bestTimes[i] !== null && (
                                    <div className="text-[11px] font-black font-mono tracking-tighter px-2 py-1 rounded border bg-green-500/10 text-green-400 border-green-500/20 whitespace-nowrap shadow-sm">
                                        BEST: {bestTimes[i]}ms
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalysisView = ({ data, peaks, status, history, setCurrentView, savePeaks, formatTime }) => (
    <div className="space-y-8">
        <div className="flex justify-between items-center glass p-4 px-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
                <Activity className="text-blue-400" /> Live-Analyse
            </h3>
            <button onClick={() => setCurrentView('menu')} className="bg-slate-800 hover:bg-slate-700">
                <ArrowLeft size={18} className="mr-2" /> Zurück zum Menü
            </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
                <div className="glass p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <Activity className={status === 'Connected' ? "text-green-400" : "text-red-400"} />
                            <h3 className="text-xl font-semibold">Live-Analyse & Peak-Tracking</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status === 'Connected' ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                                {status}
                            </span>
                        </div>
                        <div className="flex items-center gap-6 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Links
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div> Rechts
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col pt-6 px-4" style={{ height: '450px', minHeight: '450px' }}>
                        <div className="flex justify-between px-8 absolute top-4 left-0 right-0 z-10 pointer-events-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/70">Linke Hand</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/70">Rechte Hand</span>
                        </div>

                        <div className="flex-1 w-full mt-10 h-full" style={{ minHeight: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={[
                                        ...[0, 3, 2, 1, 4].map(i => ({ name: `${fingerNames[i]} L\n${data.values[i]}g`, force: data.values[i], peak: peaks[i] })),
                                        ...[5, 6, 7, 8, 9].map(i => ({ name: `${fingerNames[i]} R\n${data.values[i]}g`, force: data.values[i], peak: peaks[i] }))
                                    ]}
                                    margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
                                >
                                    <defs>
                                        <linearGradient id="colorForce" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={<CustomXAxisTick />}
                                        interval={0}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis domain={[0, 5000]} tickCount={6} allowDataOverflow={true} stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(val) => `${val}g`} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="peak" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPeak)" name="Bestleistung" isAnimationActive={false} />
                                    <Area type="monotone" dataKey="force" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorForce)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} name="Aktuell" isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="glass p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="text-yellow-400" size={20} />
                        <h3 className="text-slate-400 text-xs uppercase tracking-wider">Finger-Bestleistungen</h3>
                    </div>

                    <div className="mb-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/60 mb-2">Linke Hand</p>
                        <div className="flex gap-3">
                            {[0, 3, 2, 1, 4].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                    <span className="text-[8px] font-bold uppercase text-blue-400">{fingerNames[i]}</span>
                                    <span className="text-[11px] font-mono font-bold text-white">{peaks[i]}g</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/60 mb-2">Rechte Hand</p>
                        <div className="flex gap-3">
                            {[5, 6, 7, 8, 9].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                    <span className="text-[8px] font-bold uppercase text-purple-400">{fingerNames[i]}</span>
                                    <span className="text-[11px] font-mono font-bold text-white">{peaks[i]}g</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass p-8 flex-1 flex flex-col min-h-[500px] overflow-hidden">
                        <div className="flex items-center justify-between mb-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <History className="text-white" size={20} />
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Mess-Verlauf & Vergleich</h3>
                            </div>
                        </div>

                        <div className="flex gap-32 overflow-x-auto pb-6 custom-scrollbar flex-1">
                            {history.length === 0 ? (
                                <div className="w-full text-center py-20 opacity-30 italic font-medium">Bisher keine Messungen vorhanden.</div>
                            ) : (
                                [...history].reverse().map((record, idx) => (
                                    <div key={idx} className="min-w-[260px] flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                        <div className="mb-8">
                                            <div className="text-[14px] text-white font-black uppercase tracking-tight mb-1">Messung {history.length - idx}</div>
                                            <div className="flex flex-col opacity-40 font-mono text-[10px] leading-tight">
                                                <span>{new Date(record.timestamp).toLocaleDateString('de-AT')}</span>
                                                <span>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {record.fingerPeaks.map((p, pi) => (
                                                <div key={pi} className="flex items-center justify-between gap-8 py-1 border-b border-white/[0.02]">
                                                    <span className="text-[14px] font-black text-white uppercase tracking-tighter min-w-[110px]">
                                                        {fingerNames[pi].toUpperCase()} ({pi < 5 ? 'L' : 'R'})
                                                    </span>
                                                    <span className="text-[14px] font-mono font-black text-slate-200">
                                                        {p}g
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const App = () => {
    const [patient, setPatient] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [data, setData] = useState({ values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
    const [peaks, setPeaks] = useState(new Array(10).fill(0));
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState('Getrennt');
    const [currentView, setCurrentView] = useState('menu');

    const socketRef = useRef();

    useEffect(() => {
        const serverUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        socketRef.current = io(serverUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        socketRef.current.on('connect', () => {
            setStatus('Verbunden');
        });

        socketRef.current.on('disconnect', (reason) => {
            setStatus('Getrennt');
        });

        socketRef.current.on('connect_error', (err) => {
            setStatus('Fehler: ' + err.message);
        });

        socketRef.current.on('data', (newData) => {
            if (newData && newData.values && Array.isArray(newData.values)) {
                setData(newData);
                setPeaks(prevPeaks => {
                    const nextPeaks = [...prevPeaks];
                    newData.values.forEach((val, i) => {
                        if (val > nextPeaks[i]) nextPeaks[i] = val;
                    });
                    return nextPeaks;
                });
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleLogin = async () => {
        if (!nameInput.trim()) return;

        let p = await db.patients.where('name').equals(nameInput).first();
        if (!p) {
            const id = await db.patients.add({ name: nameInput });
            p = { id, name: nameInput };
        }

        setPatient(p);
        setCurrentView('menu');
        loadHistory(p.id);

        const storedBests = await db.fingerBests.where('patientId').equals(p.id).first();
        if (storedBests) {
            setPeaks(storedBests.values);
        } else {
            setPeaks(new Array(10).fill(0));
        }
    };

    const loadHistory = async (patientId) => {
        const h = await db.records.where('patientId').equals(patientId).reverse().limit(6).toArray();
        setHistory(h);
    };

    useEffect(() => {
        if (!patient) return;
        const totalPeak = Math.max(...peaks);
        if (totalPeak === 0) return;

        const timeoutId = setTimeout(async () => {
            const storedBests = await db.fingerBests.where('patientId').equals(patient.id).first();
            const newBests = peaks.map((val, i) => Math.max(val, storedBests ? storedBests.values[i] : 0));

            if (storedBests) {
                await db.fingerBests.update(storedBests.id, { values: newBests });
            } else {
                await db.fingerBests.add({ patientId: patient.id, values: newBests });
            }

            const lastRecord = await db.records.where('patientId').equals(patient.id).last();
            const now = Date.now();

            if (lastRecord && (now - lastRecord.timestamp < 10 * 60 * 1000)) {
                await db.records.update(lastRecord.id, { fingerPeaks: newBests, timestamp: now });
            } else {
                await db.records.add({ patientId: patient.id, fingerPeaks: newBests, timestamp: now });
            }

            loadHistory(patient.id);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [peaks, patient]);

    const savePeaks = () => {};

    const resetSession = () => {
        setPatient(null);
        setNameInput('');
        setPeaks(new Array(10).fill(0));
        setHistory([]);
        setCurrentView('menu');
    };

    if (!patient) {
        return (
            <div className="glass p-12 max-w-md mx-auto mt-20">
                <div className="flex justify-center mb-6">
                    <Fingerprint size={64} className="text-blue-400" />
                </div>
                <h1>Dactylus</h1>
                <p className="text-slate-400 mb-8">Interaktives Kraft-Messsystem</p>
                <input
                    type="text"
                    placeholder="Patientenname eingeben..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button onClick={(e) => { e.currentTarget.blur(); handleLogin(); }} className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-500/20 cursor-pointer">
                    Sitzung starten
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <header className="flex justify-between items-center glass p-6 mb-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                        <User className="text-blue-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Aktiver Patient</p>
                        <h2 className="text-xl font-bold">{patient.name}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={(e) => { e.currentTarget.blur(); resetSession(); }} className="bg-slate-800 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                        <ArrowLeft size={18} /> Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {currentView === 'menu' && <MenuView setCurrentView={setCurrentView} />}
                {currentView === 'analysis' && <AnalysisView data={data} peaks={peaks} status={status} history={history} setCurrentView={setCurrentView} savePeaks={savePeaks} />}
                {currentView === 'game' && <ReactionGame data={data} peaks={peaks} setCurrentView={setCurrentView} patient={patient} />}
                {currentView === 'about' && <AboutUs setCurrentView={setCurrentView} />}
            </main>
        </div>
    );
};

export default App;
