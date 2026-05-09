import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Calendar, Users, Package, AlertCircle, Plus, 
  Clock, ChevronRight, Activity, Syringe, X,
  CheckCircle2, ArrowLeft, FilePlus, UserCheck, UserX, Stethoscope, Scissors
} from 'lucide-react';
import { DB, initDB, Pet, StockItem, Appointment, Employee } from './db';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isConsulting, setIsConsulting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  useEffect(() => {
    initDB();
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-emerald-600 flex items-center justify-center text-white">Carregando Banco de Dados...</div>;

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen sm:p-4">
      <div className="w-full max-w-md bg-gray-50 h-[100dvh] sm:h-[90vh] sm:rounded-[40px] flex flex-col shadow-2xl relative overflow-hidden ring-4 ring-gray-800">
        
        {/* Header */}
        <header className="bg-emerald-600 text-white pt-10 pb-6 px-6 rounded-b-3xl shadow-md z-10 shrink-0">
          <div className="flex justify-between items-center">
            {isConsulting ? (
               <div className="flex items-center space-x-3">
                 <button onClick={() => setIsConsulting(false)} className="p-2 -ml-2 rounded-full hover:bg-emerald-500 transition">
                   <ArrowLeft size={24} />
                 </button>
                 <h1 className="text-xl font-bold">Atendimento</h1>
               </div>
            ) : (
              <div>
                <p className="text-emerald-100 text-sm font-medium">Clínica PetVida</p>
                <h1 className="text-2xl font-bold tracking-tight">
                  {activeTab === 'home' && 'Painel'}
                  {activeTab === 'patients' && 'Pets & Equipe'}
                  {activeTab === 'stock' && 'Estoque'}
                  {activeTab === 'calendar' && 'Agenda'}
                </h1>
              </div>
            )}
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-400">
              <span className="font-bold text-sm">RC</span>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto pb-32 px-6 pt-6 relative scroll-smooth">
          <AnimatePresence mode="wait">
            {isConsulting ? (
              <ConsultationScreen key="consultation" onFinish={() => { setActiveTab('home'); setIsConsulting(false); }} />
            ) : (
              <motion.div
                key={activeTab}
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {activeTab === 'home' && <DashboardScreen onStartConsult={() => setIsConsulting(true)} />}
                {activeTab === 'patients' && <PatientsScreen />}
                {activeTab === 'stock' && <StockScreen />}
                {activeTab === 'calendar' && <AgendaScreen />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Menu de Ação Rápida (Bottom Sheet) */}
        <AnimatePresence>
          {isActionMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30"
                onClick={() => setIsActionMenuOpen(false)}
              />
              <motion.div 
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-40 p-6 pb-12"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Nova Ação</h3>
                  <button onClick={() => setIsActionMenuOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => { setActiveTab('calendar'); setIsActionMenuOpen(false); }} className="flex flex-col items-center space-y-2 group">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calendar size={28} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 text-center">Agendar</span>
                  </button>
                  <button onClick={() => { setActiveTab('patients'); setIsActionMenuOpen(false); }} className="flex flex-col items-center space-y-2 group">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users size={28} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 text-center">Cadastrar Pet</span>
                  </button>
                  <button onClick={() => { setActiveTab('stock'); setIsActionMenuOpen(false); }} className="flex flex-col items-center space-y-2 group">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Package size={28} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 text-center">Nova Entrada</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <AnimatePresence>
          {!isConsulting && (
            <motion.nav 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', bounce: 0.2 }}
              className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex justify-between items-center z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
            >
              <NavItem icon={<Home size={24} />} label="Início" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<Calendar size={24} />} label="Agenda" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
              
              <div className="relative -top-6">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsActionMenuOpen(true)}
                  className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center"
                >
                  <Plus size={28} />
                </motion.button>
              </div>
              
              <NavItem icon={<Users size={24} />} label="Cadastros" isActive={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
              <NavItem icon={<Package size={24} />} label="Estoque" isActive={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
            </motion.nav>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- Telas Principais ---

function DashboardScreen({ onStartConsult }: { onStartConsult: () => void }) {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    DB.stock.getAll().then(setStock);
    DB.appointments.getAll().then(setAppointments);
  }, []);

  const criticalStock = stock.filter(s => s.quantity <= s.minQuantity);

  return (
    <div className="space-y-8">
      {criticalStock.length > 0 && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex items-start space-x-3 shadow-sm">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-red-800 font-semibold text-sm">Atenção ao Estoque!</h3>
            <p className="text-red-600 text-xs mt-1">
              <span className="font-bold">{criticalStock[0].name}</span> está com saldo {criticalStock[0].quantity} (Mín: {criticalStock[0].minQuantity})
            </p>
          </div>
        </motion.div>
      )}

      <section>
        <h2 className="text-gray-800 font-bold text-lg mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionButton icon={<Calendar size={24} />} label="Agendar" color="bg-blue-50 text-blue-600" />
          <QuickActionButton icon={<Users size={24} />} label="Novo Pet" color="bg-purple-50 text-purple-600" />
          <QuickActionButton icon={<Activity size={24} />} label="Prontuário" color="bg-amber-50 text-amber-600" onClick={onStartConsult} />
          <QuickActionButton icon={<Syringe size={24} />} label="Baixa Estoque" color="bg-emerald-50 text-emerald-600" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-bold text-lg">Próximos Hoje</h2>
          <button className="text-emerald-600 text-sm font-medium flex items-center">
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          {appointments.map((apt, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              key={apt.id} 
              className={`bg-white p-4 rounded-2xl shadow-sm border ${apt.status === 'waiting' ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'} flex items-center justify-between cursor-pointer`}
              onClick={apt.status === 'waiting' ? onStartConsult : undefined}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center min-w-[60px] ${apt.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-700'}`}>
                  <Clock size={16} className="mb-1" />
                  <span className="font-bold text-sm">{apt.time}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-800">{apt.petName}</h4>
                    {apt.status === 'waiting' && <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Aguardando</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{apt.service} • {apt.tutorName}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Tela de Gestão de Pacientes e Funcionários (Funcional com BD)
function PatientsScreen() {
  const [activeSubTab, setActiveSubTab] = useState<'pets' | 'staff'>('pets');
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [staff, setStaff] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', species: '', breed: '', tutorName: '', tutorPhone: '' });

  useEffect(() => {
    loadData();
  }, [activeSubTab]);

  const loadData = () => {
    setLoading(true);
    if (activeSubTab === 'pets') {
      DB.pets.getAll().then(data => { setPets(data); setLoading(false); });
    } else {
      DB.employees.getAll().then(data => { setStaff(data); setLoading(false); });
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    await DB.pets.add(form);
    setShowForm(false);
    setForm({ name: '', species: '', breed: '', tutorName: '', tutorPhone: '' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
        <button onClick={() => setActiveSubTab('pets')} className={`flex-1 font-bold text-sm py-2.5 rounded-xl transition-all ${activeSubTab === 'pets' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}>
          Pets
        </button>
        <button onClick={() => setActiveSubTab('staff')} className={`flex-1 font-bold text-sm py-2.5 rounded-xl transition-all ${activeSubTab === 'staff' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}>
          Profissionais
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'pets' ? (
          <motion.div key="pets" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            {showForm ? (
              <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAddPet} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center"><FilePlus className="mr-2" size={20}/> Cadastrar Novo Pet</h3>
                <input required placeholder="Nome do Pet" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <div className="flex space-x-3">
                  <input required placeholder="Espécie (Cão, Gato...)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.species} onChange={e => setForm({...form, species: e.target.value})} />
                  <input placeholder="Raça" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
                </div>
                <input required placeholder="Nome do Tutor" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.tutorName} onChange={e => setForm({...form, tutorName: e.target.value})} />
                <input required placeholder="Telefone do Tutor" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.tutorPhone} onChange={e => setForm({...form, tutorPhone: e.target.value})} />
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 text-white font-bold bg-emerald-600 rounded-xl shadow-md">Salvar</button>
                </div>
              </motion.form>
            ) : (
              <>
                <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 bg-emerald-50 rounded-2xl p-4 flex items-center justify-center font-bold space-x-2 hover:bg-emerald-100 transition-colors">
                  <Plus size={20} /> <span>Cadastrar Pet</span>
                </button>
                {loading ? <p className="text-center text-gray-400 py-4">Carregando...</p> : pets.map((pet) => (
                  <div key={pet.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{pet.name}</h4>
                        <p className="text-xs text-gray-500">{pet.species} • {pet.breed}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Tutor:</span> {pet.tutorName}
                      </div>
                      <button className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">Ver Ficha</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="staff" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Veja a disponibilidade da equipe para novos agendamentos rápidos.</p>
            {loading ? <p className="text-center text-gray-400 py-4">Carregando...</p> : staff.map((emp) => {
              const isFree = emp.status === 'Livre';
              const isBusy = emp.status === 'Em atendimento';
              
              return (
                <div key={emp.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full flex items-center justify-center ${isFree ? 'bg-emerald-50 text-emerald-600' : isBusy ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-400'}`}>
                      {emp.role === 'Veterinário' ? <Stethoscope size={20} /> : <Scissors size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{emp.name}</h4>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center space-x-1 border ${isFree ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : isBusy ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    {isFree ? <CheckCircle2 size={12} /> : isBusy ? <Clock size={12} /> : <UserX size={12} />}
                    <span className="text-[10px] font-bold uppercase">{emp.status}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tela de Estoque
function StockScreen() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStock(); }, []);

  const loadStock = () => {
    setLoading(true);
    DB.stock.getAll().then(data => { setStock(data); setLoading(false); });
  };

  const handleUpdate = async (id: string, delta: number) => {
    await DB.stock.updateQuantity(id, delta);
    loadStock();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">Gerencie entradas e saídas.</p>
        <button className="text-emerald-600 bg-emerald-50 p-2 rounded-xl"><Plus size={20} /></button>
      </div>

      {loading ? <p className="text-center text-gray-400 py-4">Carregando Estoque...</p> : stock.map((item) => {
        const isCritical = item.quantity <= item.minQuantity;
        return (
          <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${isCritical ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-100'} flex items-center justify-between`}>
            <div>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className={`text-xs font-semibold mt-1 ${isCritical ? 'text-red-600' : 'text-gray-500'}`}>
                {isCritical && <AlertCircle size={12} className="inline mr-1" />}
                Mínimo recomendado: {item.minQuantity}
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button onClick={() => handleUpdate(item.id, -1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-red-500 active:bg-gray-100 transition">-</button>
              <span className={`font-bold w-6 text-center ${isCritical ? 'text-red-600' : 'text-gray-800'}`}>{item.quantity}</span>
              <button onClick={() => handleUpdate(item.id, 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500 active:bg-gray-100 transition">+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Tela de Agenda e Prontuário
function AgendaScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">12 de Outubro</h2>
        <div className="flex space-x-2">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, i) => (
            <div key={dia} className={`flex flex-col items-center p-2 rounded-xl min-w-[45px] ${i === 2 ? 'bg-emerald-500 text-white font-bold shadow-md' : 'bg-white text-gray-500'}`}>
              <span className="text-[10px] uppercase">{dia}</span>
              <span className="text-lg">{10+i}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-8 mt-8">
        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-2 border-2 border-white"></div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-emerald-600 font-bold text-sm mb-1">09:00 - 09:30</p>
          <h3 className="font-bold text-gray-800">Consulta • Rex</h3>
          <p className="text-xs text-gray-500 mt-1">Dr. Carlos</p>
        </motion.div>
        
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-[140px] border-2 border-white"></div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-70">
          <p className="text-gray-500 font-bold text-sm mb-1">10:30 - 11:00</p>
          <h3 className="font-bold text-gray-800">Banho e Tosa • Mila</h3>
          <p className="text-xs text-gray-500 mt-1">Roberto</p>
        </motion.div>
      </div>
    </div>
  );
}

function ConsultationScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(1);
  const [stockUpdated, setStockUpdated] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  useEffect(() => { DB.stock.getAll().then(setStockItems); }, []);

  const handleUseItem = async (itemId: string) => {
    await DB.stock.updateQuantity(itemId, -1);
    setStockUpdated(true);
  };

  const vacinaItem = stockItems.find(i => i.name.includes('Vacina V10'));

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6 h-full flex flex-col pb-8">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div><h2 className="text-2xl font-bold text-gray-800">Rex</h2><p className="text-sm text-gray-500">Cão • Golden Retriever</p></div>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Consulta</div>
        </div>
        <div className="flex space-x-2 border-t border-gray-100 pt-4 mt-2 relative">
          <button onClick={() => setStep(1)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition relative z-10 ${step === 1 ? 'text-white' : 'text-gray-500'}`}>
            Prontuário {step === 1 && <motion.div layoutId="pill" className="absolute inset-0 bg-gray-800 rounded-xl -z-10" />}
          </button>
          <button onClick={() => setStep(2)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition relative z-10 ${step === 2 ? 'text-white' : 'text-gray-500'}`}>
            Insumos {step === 2 && <motion.div layoutId="pill" className="absolute inset-0 bg-gray-800 rounded-xl -z-10" />}
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-4">
            <div><label className="text-sm font-bold text-gray-700 ml-1">Anamnese / Sintomas</label><textarea className="w-full mt-1 bg-white border border-gray-200 rounded-2xl p-4 h-32 focus:ring-2 focus:ring-emerald-500 outline-none resize-none shadow-sm" placeholder="Descreva os sintomas..."></textarea></div>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3"><Syringe className="text-blue-500" /><div><h4 className="font-bold text-blue-900">Vacina V10</h4><p className="text-xs text-blue-700">Em estoque: {vacinaItem ? vacinaItem.quantity : 0}</p></div></div>
              {!stockUpdated && vacinaItem ? (
                 <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUseItem(vacinaItem.id)} className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-blue-200 hover:bg-blue-600 hover:text-white transition">Utilizar (1)</motion.button>
              ) : (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-white p-2 rounded-full"><CheckCircle2 size={20} /></motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pt-4 mt-auto"><motion.button whileTap={{ scale: 0.95 }} onClick={onFinish} className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-600/30">Finalizar Atendimento</motion.button></div>
    </motion.div>
  );
}

// Componentes Utilitários
function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 w-16 transition-colors relative ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
      {isActive && <motion.div layoutId="nav-pill" className="absolute -top-[17px] w-8 h-1 bg-emerald-500 rounded-b-full" />}
      <motion.div animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }} transition={{ type: "spring", stiffness: 300 }}>{icon}</motion.div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function QuickActionButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className={`${color} p-4 rounded-2xl flex flex-col items-start space-y-3 shadow-sm border border-transparent hover:border-black/5`}>
      <div className="bg-white/70 p-2 rounded-xl backdrop-blur-sm">{icon}</div><span className="font-semibold text-sm">{label}</span>
    </motion.button>
  );
}
