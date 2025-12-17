import React, { useState, useMemo } from 'react';
import { VEHICLE_DATA } from './constants';
import { Vehicle, FilterStatus } from './types';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldBan,
  Filter,
  Car,
  Phone,
  Building2,
  User,
  Info,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  List as ListIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Components ---

const StatusBadge: React.FC<{ reaction: string; status: Vehicle['reactionStatus'] }> = ({ reaction, status }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const icons = {
    success: <ShieldCheck className="w-3 h-3 mr-1" />,
    danger: <ShieldBan className="w-3 h-3 mr-1" />,
    warning: <ShieldAlert className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
      {icons[status]}
      {reaction}
    </span>
  );
};

const VehicleCard: React.FC<{ vehicle: Vehicle; onClick: () => void }> = ({ vehicle, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-3 active:scale-[0.98] transition-transform duration-100 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="bg-slate-100 p-2 rounded-lg mr-3">
             <Car className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-none">{vehicle.vehicleNo}</h3>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{vehicle.type}</span>
          </div>
        </div>
        <StatusBadge reaction={vehicle.reaction} status={vehicle.reactionStatus} />
      </div>
      
      <div className="space-y-1 mt-3">
        <div className="flex items-center text-sm text-slate-600">
          <User className="w-4 h-4 mr-2 text-slate-400" />
          <span className="truncate">{vehicle.name}</span>
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Building2 className="w-4 h-4 mr-2 text-slate-400" />
          <span className="truncate">{vehicle.company}</span>
        </div>
      </div>
    </div>
  );
};

const VehicleDetailModal: React.FC<{ vehicle: Vehicle; onClose: () => void }> = ({ vehicle, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Vehicle Details</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-3 border border-slate-200">
               <Car className="w-12 h-12 text-blue-900" />
            </div>
            <h1 className="text-3xl font-black text-slate-900">{vehicle.vehicleNo}</h1>
            <p className="text-slate-500 font-medium">{vehicle.type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="col-span-2 flex justify-center">
               <StatusBadge reaction={vehicle.reaction} status={vehicle.reactionStatus} />
             </div>
          </div>

          <div className="space-y-4">
             <InfoRow icon={<User />} label="Driver Name" value={vehicle.name} />
             <InfoRow icon={<Building2 />} label="Company" value={vehicle.company} />
             <InfoRow icon={<Info />} label="Purpose" value={vehicle.purpose} />
             <InfoRow icon={<LayoutDashboard />} label="Room No" value={vehicle.room} />
             <InfoRow 
               icon={<Phone />} 
               label="Contact" 
               value={<a href={`tel:${vehicle.contact}`} className="text-blue-600 hover:underline">{vehicle.contact}</a>} 
             />
             <InfoRow 
               icon={<ShieldCheck />} 
               label="Gate Pass" 
               value={vehicle.gatePass ? <span className="text-green-600 font-bold">YES</span> : <span className="text-red-500 font-bold">NO</span>} 
             />
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
    <div className="text-slate-400 mr-3 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
      <div className="text-sm font-medium text-slate-900 break-words">{value}</div>
    </div>
  </div>
);

const StatsView: React.FC<{ data: Vehicle[] }> = ({ data }) => {
  const stats = useMemo(() => {
    const total = data.length;
    const allowed = data.filter(v => v.reactionStatus === 'success').length;
    const denied = data.filter(v => v.reactionStatus === 'danger').length;
    const pending = data.filter(v => v.reactionStatus === 'warning').length;
    
    return { total, allowed, denied, pending };
  }, [data]);

  const pieData = [
    { name: 'Allowed', value: stats.allowed, color: '#22c55e' },
    { name: 'Denied', value: stats.denied, color: '#ef4444' },
    { name: 'Pending', value: stats.pending, color: '#eab308' },
  ];

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase">Total Vehicles</p>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-green-600 text-xs font-bold uppercase">Allowed</p>
          <p className="text-3xl font-black text-green-700">{stats.allowed}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <p className="text-red-600 text-xs font-bold uppercase">Denied</p>
          <p className="text-3xl font-black text-red-700">{stats.denied}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
          <p className="text-yellow-700 text-xs font-bold uppercase">Pending</p>
          <p className="text-3xl font-black text-yellow-800">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-72">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Access Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'stats'>('search');
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredVehicles = useMemo(() => {
    return VEHICLE_DATA.filter(vehicle => {
      const matchesSearch = 
        vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === 'ALL' || 
        (filter === 'ALLOWED' && vehicle.reactionStatus === 'success') ||
        (filter === 'NOT ALLOWED' && vehicle.reactionStatus === 'danger') ||
        (filter === 'NEED PERMISSION' && vehicle.reactionStatus === 'warning');

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200">
      
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 pb-8 rounded-b-[2rem] shadow-lg sticky top-0 z-30">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-yellow-400">ROYAL CATERING</h1>
            <p className="text-blue-200 text-sm">Vehicle Access Control</p>
          </div>
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center border border-blue-700">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Reg No, Name, Company..."
            className="w-full bg-blue-800/50 border border-blue-700 text-white placeholder-blue-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
          
          <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-yellow-400 text-blue-900' : 'bg-blue-700 text-blue-200'}`}
          >
             <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 flex gap-2 flex-wrap animate-in slide-in-from-top-2 duration-200">
            {(['ALL', 'ALLOWED', 'NOT ALLOWED', 'NEED PERMISSION'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  filter === status 
                    ? 'bg-yellow-400 text-blue-900' 
                    : 'bg-blue-800 text-blue-200 border border-blue-700 hover:bg-blue-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 -mt-4 z-20 pb-20">
        {activeTab === 'search' ? (
          <div className="px-4">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredVehicles.length} Vehicles Found</span>
            </div>
            
            {filteredVehicles.length > 0 ? (
              <div className="space-y-3">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onClick={() => setSelectedVehicle(vehicle)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                 <div className="bg-slate-100 p-4 rounded-full inline-block mb-3">
                    <Search className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="text-slate-500 font-medium">No vehicles found</p>
                 <button 
                    onClick={() => {setSearchTerm(''); setFilter('ALL');}}
                    className="mt-2 text-blue-600 font-semibold text-sm"
                 >
                   Clear filters
                 </button>
              </div>
            )}
          </div>
        ) : (
          <StatsView data={VEHICLE_DATA} />
        )}
      </main>

      {/* Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
        />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 pb-safe z-40 max-w-md mx-auto shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'search' ? 'text-blue-900' : 'text-slate-400'}`}
        >
          <ListIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">Vehicles</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'stats' ? 'text-blue-900' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
      </nav>
    </div>
  );
}