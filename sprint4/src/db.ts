// src/db.ts
// Banco de Dados Local usando localStorage com API Assíncrona.

export type Pet = { id: string; name: string; species: string; breed: string; tutorName: string; tutorPhone: string; };
export type Employee = { id: string; name: string; role: 'Veterinário' | 'Tosador'; status: 'Livre' | 'Em atendimento' | 'Ausente' };
export type StockItem = { id: string; name: string; quantity: number; minQuantity: number; };
export type Appointment = { id: string; time: string; petName: string; tutorName: string; service: string; status: 'waiting' | 'scheduled' };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function getTable<T>(tableName: string): T[] {
  const data = localStorage.getItem(tableName);
  return data ? JSON.parse(data) : [];
}

function setTable<T>(tableName: string, data: T[]) {
  localStorage.setItem(tableName, JSON.stringify(data));
}

export const initDB = () => {
  if (getTable('stock').length === 0) {
    setTable('stock', [
      { id: '1', name: 'Vacina V10', quantity: 2, minQuantity: 5 },
      { id: '2', name: 'Vermífugo Plus', quantity: 15, minQuantity: 10 },
      { id: '3', name: 'Seringas 5ml', quantity: 100, minQuantity: 50 },
      { id: '4', name: 'Shampoo Neutro 5L', quantity: 1, minQuantity: 2 }
    ]);
  }
  if (getTable('pets').length === 0) {
    setTable('pets', [
      { id: '1', name: 'Rex', species: 'Cão', breed: 'Golden Retriever', tutorName: 'João Silva', tutorPhone: '11999999999' },
      { id: '2', name: 'Mila', species: 'Gato', breed: 'Siamês', tutorName: 'Ana Souza', tutorPhone: '11888888888' }
    ]);
  }
  if (getTable('appointments').length === 0) {
    setTable('appointments', [
      { id: '1', time: '09:00', petName: 'Rex', tutorName: 'João Silva', service: 'Consulta', status: 'waiting' },
      { id: '2', time: '10:30', petName: 'Mila', tutorName: 'Ana Souza', service: 'Banho e Tosa', status: 'scheduled' }
    ]);
  }
  if (getTable('employees').length === 0) {
    setTable('employees', [
      { id: '1', name: 'Dr. Carlos', role: 'Veterinário', status: 'Livre' },
      { id: '2', name: 'Dra. Amanda', role: 'Veterinário', status: 'Em atendimento' },
      { id: '3', name: 'Roberto', role: 'Tosador', status: 'Livre' },
      { id: '4', name: 'Juliana', role: 'Tosador', status: 'Ausente' }
    ]);
  }
};

export const DB = {
  pets: {
    getAll: async () => { await delay(200); return getTable<Pet>('pets'); },
    add: async (pet: Omit<Pet, 'id'>) => {
      await delay(200);
      const pets = getTable<Pet>('pets');
      const newPet = { ...pet, id: Date.now().toString() };
      setTable('pets', [...pets, newPet]);
      return newPet;
    }
  },
  employees: {
    getAll: async () => { await delay(200); return getTable<Employee>('employees'); },
    updateStatus: async (id: string, status: Employee['status']) => {
      await delay(200);
      const emps = getTable<Employee>('employees');
      const updated = emps.map(e => e.id === id ? { ...e, status } : e);
      setTable('employees', updated);
    }
  },
  stock: {
    getAll: async () => { await delay(200); return getTable<StockItem>('stock'); },
    updateQuantity: async (id: string, delta: number) => {
      await delay(200);
      const stock = getTable<StockItem>('stock');
      const updated = stock.map(s => s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s);
      setTable('stock', updated);
      return updated.find(s => s.id === id);
    }
  },
  appointments: {
    getAll: async () => { await delay(200); return getTable<Appointment>('appointments'); }
  }
};
