import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const TASKS_ROOT = path.join(__dirname, '../tasks');
const TODO_PATH = path.join(__dirname, '../TODO.md');

function getAllDomainTasks() {
  const domains: Record<string, any[]> = {};
  const domainDirs = fs.readdirSync(TASKS_ROOT).filter((d) => d.startsWith('domain-'));
  for (const dir of domainDirs) {
    const domainNum = dir.match(/domain-(\d+)/)?.[1];
    if (!domainNum) continue;
    const domainPath = path.join(TASKS_ROOT, dir);
    const files = fs
      .readdirSync(domainPath)
      .filter((f) => f.startsWith('DOMAIN-') && f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(domainPath, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(raw);
      if (!data.id || !data.title) continue;
      domains[domainNum] = domains[domainNum] || [];
      domains[domainNum].push({
        id: data.id,
        title: data.title,
        status: (data.status || 'pending').toLowerCase(),
        relPath: `tasks/${dir}/${file}`,
      });
    }
  }
  return domains;
}

function getStatusCounts(tasks: any[]) {
  let completed = 0,
    inProgress = 0,
    pending = 0;
  for (const t of tasks) {
    if (t.status === 'done') completed++;
    else if (t.status === 'in-progress') inProgress++;
    else pending++;
  }
  return { total: tasks.length, completed, inProgress, pending };
}

function renderStatusTable(domains: Record<string, any[]>) {
  let total = 0,
    completed = 0,
    inProgress = 0,
    pending = 0;
  let rows = Object.keys(domains)
    .sort((a, b) => +a - +b)
    .map((num) => {
      const { total: t, completed: c, inProgress: i, pending: p } = getStatusCounts(domains[num]);
      total += t;
      completed += c;
      inProgress += i;
      pending += p;
      return `| Domain ${num}  | ${t}           | ${c}         | ${i}           | ${p}       |`;
    });
  rows.push(
    `| **Total** | **${total}**      | **${completed}**    | **${inProgress}**       | **${pending}**  |`
  );
  return rows.join('\n');
}

function renderDomainSection(num: string, tasks: any[]) {
  const domainTitle = `Domain ${num}`;
  // Try to infer a label from the first task title, fallback to generic
  let label = 'PENDING';
  if (tasks.some((t) => t.status === 'in-progress')) label = 'IN PROGRESS';
  else if (tasks.every((t) => t.status === 'done')) label = 'COMPLETE';
  let emoji =
    label === 'COMPLETE'
      ? '✅ COMPLETE'
      : label === 'IN PROGRESS'
        ? '🔄 IN PROGRESS'
        : '🔄 PENDING';
  let section = `## ${domainTitle}: ${emoji}\n\n`;
  for (const t of tasks.sort((a, b) => a.id.localeCompare(b.id))) {
    const checked = t.status === 'done' ? 'x' : ' ';
    section += `- [${checked}] [${t.id}](${t.relPath}) - ${t.title}\n`;
  }
  return section;
}

function main() {
  const domains = getAllDomainTasks();
  const statusTable = renderStatusTable(domains);
  let content = `# TODO: Multi-Client Multi-Site Monorepo Tasks\n\nThis file provides a consolidated, checkable task list of all domain tasks across the monorepo.\n\n## Task Status Overview\n\n| Domain    | Total Tasks | Completed | In Progress | Pending |\n| --------- | ----------- | --------- | ----------- | ------- |\n${statusTable}\n`;
  for (const num of Object.keys(domains).sort((a, b) => +a - +b)) {
    content += '\n' + renderDomainSection(num, domains[num]) + '\n';
  }
  // Add footer
  const allTasks = Object.values(domains).flat();
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'done').length;
  const percent = Math.round((completed / total) * 100);
  content += `\n---\n\n_Last updated: ${new Date().toISOString().slice(0, 10)}_  \n_Total tasks: ${total}_  \n_Completed: ${completed} (${percent}%)_  \n_Remaining: ${total - completed} (${100 - percent}%)_\n`;
  fs.writeFileSync(TODO_PATH, content);
}

main();
