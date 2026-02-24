'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';
import type { Database } from '@repo/db';
import { classifyLead } from '@repo/lead-capture/scoring';

type Lead = Database['public']['Tables']['leads']['Row'];

// ============================================================================
// REALTIME LEAD FEED
// Subscribes to INSERT events on the leads table for the current tenant.
// New leads appear instantly without page refresh.
// ============================================================================

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function LeadFeed({ tenantId }: { tenantId: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>(
    'connecting'
  );
  const [newLeadIds, setNewLeadIds] = useState<Set<string>>(new Set());

  // Initial load
  useEffect(() => {
    const loadLeads = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setLeads(data);
    };

    loadLeads();
  }, [tenantId]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`leads:${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `tenant_id=eq.${tenantId}`, // RLS + filter = double protection
        },
        (payload) => {
          const newLead = payload.new as Lead;

          // Prepend new lead to list
          setLeads((prev) => [newLead, ...prev.slice(0, 49)]);

          // Highlight new lead for 5 seconds
          setNewLeadIds((prev) => new Set([...prev, newLead.id]));
          setTimeout(() => {
            setNewLeadIds((prev) => {
              const next = new Set(prev);
              next.delete(newLead.id);
              return next;
            });
          }, 5000);

          // Browser notification (if permission granted)
          if (Notification.permission === 'granted') {
            new Notification(`New Lead: ${newLead.name}`, {
              body: `Score: ${newLead.score}/100 · ${newLead.email}`,
              icon: '/favicon.ico',
              tag: newLead.id, // Replace previous notification for same lead
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const updated = payload.new as Lead;
          setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('connected');
        if (status === 'CLOSED') setConnectionStatus('error');
        if (status === 'CHANNEL_ERROR') setConnectionStatus('error');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  return (
    <div aria-label="Live lead feed" aria-live="polite" aria-atomic="false">
      {/* Connection status indicator */}
      <div className="flex items-center gap-2 mb-4" role="status">
        <div
          className={`h-2 w-2 rounded-full ${
            connectionStatus === 'connected'
              ? 'bg-green-500 animate-pulse'
              : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-yellow-500'
          }`}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-500 capitalize">{connectionStatus}</span>
      </div>

      {/* Lead list */}
      <ul className="space-y-3" role="list">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} isNew={newLeadIds.has(lead.id)} />
        ))}
      </ul>

      {leads.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No leads yet. Your first lead will appear here in real time.
        </p>
      )}
    </div>
  );
}

function LeadCard({ lead, isNew }: { lead: Lead; isNew: boolean }) {
  const tier = classifyLead(lead.score);
  const tierStyles = {
    qualified: 'border-green-500 bg-green-50',
    warm: 'border-amber-400 bg-amber-50',
    cold: 'border-gray-200 bg-white',
  };

  return (
    <li
      className={`
        border rounded-lg p-4 transition-all duration-500
        ${tierStyles[tier]}
        ${isNew ? 'ring-2 ring-blue-400 scale-[1.01]' : ''}
      `}
      aria-label={`Lead from ${lead.name}, score ${lead.score}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{lead.name}</p>
          <p className="text-sm text-gray-500">{lead.email}</p>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:underline">
              {lead.phone}
            </a>
          )}
        </div>
        <div className="text-right">
          <span
            className={`
              inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
              ${tier === 'qualified' ? 'bg-green-100 text-green-800' : ''}
              ${tier === 'warm' ? 'bg-amber-100 text-amber-800' : ''}
              ${tier === 'cold' ? 'bg-gray-100 text-gray-700' : ''}
            `}
          >
            {lead.score}/100
          </span>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(lead.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {lead.message && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{lead.message}</p>}

      {(lead.utm_source || lead.utm_source_first) && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {lead.utm_source_first && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              First: {lead.utm_source_first}
            </span>
          )}
          {lead.utm_source && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              Last: {lead.utm_source}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
