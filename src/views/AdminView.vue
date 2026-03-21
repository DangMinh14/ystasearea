<script setup lang="ts">
import { inject } from 'vue'
import UiCard from '../components/ui/UiCard.vue'
import UiSectionHeader from '../components/ui/UiSectionHeader.vue'
import type { AppShellContext } from '../composables/appShellContext'
import { appShellContextKey } from '../composables/appShellContext'

type DashboardMetric = {
  label: string
  value: string
  trend: string
}

const shell = inject<AppShellContext>(appShellContextKey)
if (!shell) {
  throw new Error('AdminView requires shell context')
}

const metrics: DashboardMetric[] = [
  { label: 'Published posts', value: '3', trend: '+2 this month' },
  { label: 'Media widgets uptime', value: '99.9%', trend: 'Stable' },
  { label: 'Theme presets', value: '5', trend: 'All active' },
  { label: 'Feature modules', value: '3', trend: 'Blog / Games / Music' },
]
</script>

<template>
  <section class="admin-view">
    <UiSectionHeader eyebrow="Admin" :title="shell.t.value.adminTitle" :subtitle="shell.t.value.adminSubtitle" />

    <div class="admin-view__metrics">
      <UiCard v-for="metric in metrics" :key="metric.label" class="admin-view__metric-card">
        <p class="text-muted">{{ metric.label }}</p>
        <h3>{{ metric.value }}</h3>
        <p class="text-muted">{{ metric.trend }}</p>
      </UiCard>
    </div>

    <UiCard class="admin-view__table-card">
      <h3>Recent activity</h3>
      <div class="admin-view__table-wrap">
        <table class="admin-view__table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blog module</td>
              <td>Ready</td>
              <td>2026-03-20</td>
            </tr>
            <tr>
              <td>Game modal UX</td>
              <td>Polished</td>
              <td>2026-03-21</td>
            </tr>
            <tr>
              <td>Music feature</td>
              <td>Ready</td>
              <td>2026-03-21</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiCard>
  </section>
</template>

<style scoped>
.admin-view {
  display: grid;
  gap: var(--space-4);
}

.admin-view__metrics {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.admin-view__metric-card {
  display: grid;
  gap: var(--space-2);
}

.admin-view__table-card {
  display: grid;
  gap: var(--space-3);
}

.admin-view__table-wrap {
  overflow: auto;
}

.admin-view__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
}

.admin-view__table th,
.admin-view__table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.admin-view__table th {
  color: var(--text-secondary);
  font-size: 0.88rem;
}
</style>
