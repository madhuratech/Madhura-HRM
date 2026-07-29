import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, MessageCircle, ChevronRight, UserPlus, Loader2 } from 'lucide-react';
import { enquiriesAPI } from '../../lib/api';

import { UpdateFollowupModal } from './UpdateFollowupModal';

import { useToast } from '../ui/Toast';

export function SalesEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await enquiriesAPI.getAll(params);
      setEnquiries(res.data.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('hrm_user') || '{}');
      const formData = new FormData(e.target);
      const newLead = {
        customerName: formData.get('customerName'),
        phone: formData.get('phone'),
        modelInterest: formData.get('modelInterest'),
        source: formData.get('source'),
        status: "NEW",
        assignedTo: user._id,
        remarks: [{ date: new Date().toISOString().split('T')[0], text: "Initial enquiry", addedBy: user.name }]
      };
      await enquiriesAPI.create(newLead);
      addToast('New lead added successfully!', 'success');
      setIsAddModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      addToast('Failed to add lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem('hrm_user') || '{}');
      await enquiriesAPI.update(data.enquiryId, {
        status: data.status,
        nextFollowUp: data.nextFollowUp
      });
      await enquiriesAPI.addRemark(data.enquiryId, {
        text: data.remarks,
        addedBy: user.name
      });
      addToast('Follow-up details updated', 'success');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      addToast('Failed to update lead', 'error');
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch = enq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CONTACTED':return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'TEST_DRIVE':return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'QUOTATION':return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'BOOKED':return 'bg-green-100 text-green-700 border-green-200';
      case 'LOST':return 'bg-slate-100 text-slate-500 border-slate-200';
      default:return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {isAddModalOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add New Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input name="customerName" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input name="phone" type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter phone" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model Interest</label>
                  <select name="modelInterest" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Select...</option>
                    <option value="Cruiser 500">Cruiser 500</option>
                    <option value="Scooter Z">Scooter Z</option>
                    <option value="Sport Bike X1">Sport Bike X1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <select name="source" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Walk-in">Walk-in</option>
                    <option value="Online">Online</option>
                    <option value="Referral">Referral</option>
                    <option value="Phone">Phone Enquiry</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />} Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {selectedEnquiry &&
      <UpdateFollowupModal
        isOpen={true}
        onClose={() => setSelectedEnquiry(null)}
        onSubmit={handleUpdate}
        enquiry={selectedEnquiry} />

      }

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Leads & Enquiries</h2>
          <p className="text-sm text-slate-500">Manage follow-ups and customer status</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
          
          <UserPlus size={18} /> Add New Lead
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          
        </div>
        <select
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium text-slate-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}>
          
          <option value="ALL">All Status</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="TEST_DRIVE">Test Drive</option>
          <option value="QUOTATION">Quotation</option>
          <option value="BOOKED">Booked</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="col-span-full text-center p-12 text-slate-500">
            No leads found.
          </div>
        ) : filteredEnquiries.map((enq) =>
        <div key={enq._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                  {enq.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{enq.customerName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} /> {enq.phone}
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(enq.status)}`}>
                {enq.status.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Last Remark</p>
              <p className="text-sm text-slate-700 line-clamp-2">
                "{enq.remarks && enq.remarks.length > 0 ? enq.remarks[enq.remarks.length - 1].text : 'No remarks yet'}"
              </p>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{enq.remarks && enq.remarks.length > 0 ? enq.remarks[enq.remarks.length - 1].date : ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase">Next Follow-up</span>
                <span className={`text-sm font-bold flex items-center gap-1 ${new Date(enq.nextFollowUp) < new Date() ? 'text-red-600' : 'text-slate-700'}`}>
                  <Calendar size={14} />
                  {enq.nextFollowUp}
                </span>
              </div>
              
              <button
              onClick={() => setSelectedEnquiry(enq)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors">
              
                <MessageCircle size={16} /> Follow Up
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

}