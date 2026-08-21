import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Wrench, ShieldCheck, Clock } from 'lucide-react';
import { adminService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';

export const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Team Modal
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDeptId, setTeamDeptId] = useState('');
  const [teamWard, setTeamWard] = useState('Ward 12');
  const [teamZone, setTeamZone] = useState('Central Zone');
  const [teamLoading, setTeamLoading] = useState(false);

  const fetchDeptAndTeams = async () => {
    setLoading(true);
    try {
      const [deptRes, teamRes] = await Promise.all([
        adminService.getDepartments(),
        adminService.getTeams()
      ]);
      if (deptRes.success) setDepartments(deptRes.departments || []);
      if (teamRes.success) setTeams(teamRes.teams || []);
    } catch (err) {
      console.error('Error fetching department data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeptAndTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || !teamDeptId) return;
    setTeamLoading(true);
    try {
      const res = await adminService.createTeam({
        name: teamName,
        departmentId: teamDeptId,
        ward: teamWard,
        zone: teamZone
      });
      if (res.success) {
        setIsTeamModalOpen(false);
        setTeamName('');
        fetchDeptAndTeams();
      }
    } catch (err) {
      alert('Failed to create team: ' + (err.response?.data?.message || err.message));
    } finally {
      setTeamLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading municipal departments and field team structures..." size="lg" />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Departments & Specialized Field Teams
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure municipal competency boundaries, rapid response units, and department-specific SLA hours.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsTeamModalOpen(true)}
        >
          Create Field Team
        </Button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((d) => {
          const deptTeams = teams.filter(t => t.department?._id === d._id || t.department === d._id);
          return (
            <div
              key={d._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-civic-50 dark:bg-civic-950 text-civic-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{d.code}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {d.description}
                </p>

                {/* SLA Specs */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">SLA Targets:</span>
                  <div className="grid grid-cols-4 gap-1 text-center font-semibold">
                    <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 p-1 rounded">Crit: {d.slaHours?.Critical || 24}h</div>
                    <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 p-1 rounded">High: {d.slaHours?.High || 48}h</div>
                    <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 p-1 rounded">Med: {d.slaHours?.Medium || 72}h</div>
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 p-1 rounded">Low: {d.slaHours?.Low || 168}h</div>
                  </div>
                </div>

                {/* Teams under this department */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Field Response Units ({deptTeams.length}):
                  </span>
                  <div className="space-y-1.5">
                    {deptTeams.map((t) => (
                      <div key={t._id} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{t.name}</span>
                        <span className="text-[10px] text-slate-400">{t.ward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Create Specialized Field Team"
        subtitle="Add a new rapid response squad to a municipal department."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Team / Squad Name *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Rapid Bitumen Patching Squad"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Department *
            </label>
            <select
              required
              value={teamDeptId}
              onChange={(e) => setTeamDeptId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500"
            >
              <option value="">Select Department...</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ward</label>
              <input
                type="text"
                value={teamWard}
                onChange={(e) => setTeamWard(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Zone</label>
              <input
                type="text"
                value={teamZone}
                onChange={(e) => setTeamZone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsTeamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={teamLoading}>
              Create Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
