import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.css'
import { Navbar } from '../components/Navbar'
import { ApplicationDetails } from '../components/ApplicationDetails'
import type { Application, Status } from '../types/application.types'
import { ApplicationModal } from '../components/ApplicationModal'

const stats = [
	{ label: 'Total Applied', value: '12', icon: '📋', color: '#e8f4fd' },
	{ label: 'Interviews', value: '4', icon: '📅', color: '#fef3e2' },
	{ label: 'Offers', value: '1', icon: '🎉', color: '#e6f9f0' },
	{ label: 'Rejected', value: '3', icon: '❌', color: '#fde8e8' },
]

const applications: Application[] = [
	{
		id: 1, company: 'Stripe', location: 'Remote',
		role: 'Backend Engineer', type: 'Full-time', date: 'Mar 18, 2026', status: 'Interview',
		notes: 'Applied through LinkedIn. Referral from John at Stripe.',
		interviews: [
			{ id: 1, title: 'Technical Screen', date: 'Mar 22, 2026 · 10:00 AM', note: 'With the hiring manager' },
			{ id: 2, title: 'System Design', date: 'Mar 25, 2026 · 2:00 PM', note: 'Focus on distributed systems' },
		]
	},
	{
		id: 2, company: 'Notion', location: 'San Francisco, CA',
		role: 'Full Stack Developer', type: 'Full-time', date: 'Mar 15, 2026', status: 'Applied',
		notes: 'Applied via careers page. Love their product.',
		interviews: []
	},
	{
		id: 3, company: 'Vercel', location: 'Remote',
		role: 'Node.js Engineer', type: 'Full-time', date: 'Mar 12, 2026', status: 'Offer',
		notes: 'Got an offer! Reviewing the package.',
		interviews: [
			{ id: 1, title: 'Final Round', date: 'Mar 19, 2026 · 11:00 AM', note: 'With CTO and team lead' },
		]
	},
	{
		id: 4, company: 'Linear', location: 'Remote',
		role: 'Software Engineer', type: 'Full-time', date: 'Mar 10, 2026', status: 'Rejected',
		notes: 'Got rejected after the technical screen. Follow up on feedback.',
		interviews: []
	},
	{
		id: 5, company: 'Figma', location: 'New York, NY',
		role: 'API Developer', type: 'Full-time', date: 'Mar 8, 2026', status: 'Ghosted',
		notes: 'No response after 2 follow-ups.',
		interviews: []
	},
	{
		id: 6, company: 'Supabase', location: 'Remote',
		role: 'Backend Developer', type: 'Full-time', date: 'Mar 5, 2026', status: 'Interview',
		notes: 'First interview went well. Waiting for next steps.',
		interviews: [
			{ id: 1, title: 'Culture Fit', date: 'Mar 23, 2026 · 3:00 PM', note: 'With People Ops' },
		]
	},
	{
		id: 7, company: 'PlanetScale', location: 'Remote',
		role: 'Software Engineer', type: 'Contract', date: 'Mar 2, 2026', status: 'Applied',
		notes: 'Contract position, 6 months. Good opportunity.',
		interviews: []
	},
	{
		id: 8, company: 'Railway', location: 'Remote',
		role: 'Platform Engineer', type: 'Full-time', date: 'Feb 28, 2026', status: 'Applied',
		notes: 'Applied directly through their site.',
		interviews: []
	},
	{
		id: 9, company: 'Resend', location: 'Remote',
		role: 'Backend Engineer', type: 'Full-time', date: 'Feb 25, 2026', status: 'Rejected',
		notes: 'Not a good fit at this time.',
		interviews: []
	},
	{
		id: 10, company: 'Turso', location: 'Remote',
		role: 'Software Engineer', type: 'Full-time', date: 'Feb 22, 2026', status: 'Applied',
		notes: 'Interesting edge database product.',
		interviews: []
	},
	{
		id: 11, company: 'Neon', location: 'Remote',
		role: 'Backend Developer', type: 'Full-time', date: 'Feb 20, 2026', status: 'Applied',
		notes: 'Serverless Postgres, great stack.',
		interviews: []
	},
	{
		id: 12, company: 'Clerk', location: 'Remote',
		role: 'API Engineer', type: 'Full-time', date: 'Feb 18, 2026', status: 'Interview',
		notes: 'Auth company, relevant to current project.',
		interviews: [
			{ id: 1, title: 'Intro Call', date: 'Mar 24, 2026 · 1:00 PM', note: 'With recruiter' },
		]
	},
]

const statusStyles: Record<Status, string> = {
	Applied: styles.badgeApplied,
	Interview: styles.badgeInterview,
	Offer: styles.badgeOffer,
	Rejected: styles.badgeRejected,
	Ghosted: styles.badgeGhosted,
}

const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']
const PAGE_SIZE = 10

export default function Dashboard() {
	const { user } = useAuth()
	const [activeFilter, setActiveFilter] = useState('All')
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedApp, setSelectedApp] = useState<Application | null>(null)
	const [modal, setModal] = useState<{ mode: 'add' | 'edit', app?: Application } | null>(null)

	const filtered = activeFilter === 'All'
		? applications
		: applications.filter(a => a.status === activeFilter)

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
	const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

	const handleFilterChange = (f: string) => {
		setActiveFilter(f)
		setCurrentPage(1)
	}

	const handleRowClick = (app: Application) => {
		setSelectedApp(app)
	}

	const greeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 18) return 'Good afternoon'
		return 'Good evening'
	}

	const MAX_PAGINATION_OPTIONS = 5

	let startPage = Math.max(currentPage - Math.floor(MAX_PAGINATION_OPTIONS / 2), 1)
	let endPage = startPage + MAX_PAGINATION_OPTIONS - 1

	if (endPage > totalPages) {
		endPage = totalPages
		startPage = Math.max(endPage - MAX_PAGINATION_OPTIONS + 1, 1)
	}

	const visiblePages = Array.from(
		{ length: endPage - startPage + 1 },
		(_, i) => startPage + i
	)

	return (
		<div className={styles.container}>

			<Navbar />

			{/* Main */}
			<main className={styles.main}>

				{/* Header */}
				<div className={styles.header}>
					<p className={styles.headerDate}>
						{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
					</p>
					<h1 className={styles.headerTitle}>
						{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
					</h1>
				</div>

				{/* Stats */}
				<div className={styles.stats}>
					{stats.map((stat, i) => (
						<div key={i} className={styles.statCard}>
							<div className={styles.statIcon} style={{ background: stat.color }}>{stat.icon}</div>
							<p className={styles.statValue}>{stat.value}</p>
							<p className={styles.statLabel}>{stat.label}</p>
						</div>
					))}
				</div>

				{/* Section header */}
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Applications</h2>
					<button className={styles.addBtn} onClick={() => setModal({ mode: 'add' })}>
						+ Add Application
					</button>
				</div>

				{/* Filters */}
				<div className={styles.filters}>
					{filters.map(f => (
						<button
							key={f}
							className={`${styles.filterTab} ${activeFilter === f ? styles.filterTabActive : ''}`}
							onClick={() => handleFilterChange(f)}
						>
							{f}
						</button>
					))}
				</div>

				{/* Table */}
				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead className={styles.tableHead}>
							<tr>
								<th>Company</th>
								<th>Role</th>
								<th>Type</th>
								<th>Applied</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{paginated.map(app => (
								<tr
									key={app.id}
									className={`${styles.tableRow} ${selectedApp?.id === app.id ? styles.tableRowActive : ''}`}
									onClick={() => handleRowClick(app)}
								>
									<td>
										<div className={styles.companyCell}>
											<div>
												<div className={styles.companyName}>{app.company}</div>
												<div className={styles.companyLocation}>{app.location}</div>
											</div>
										</div>
									</td>
									<td className={styles.roleText}>{app.role}</td>
									<td className={styles.roleText}>{app.type}</td>
									<td className={styles.dateText}>{app.date}</td>
									<td>
										<span className={`${styles.badge} ${statusStyles[app.status]}`}>
											<span className={styles.badgeDot} />
											{app.status}
										</span>
									</td>
									<td>
										<button
											className={styles.actionBtn}
											onClick={e => { e.stopPropagation(); handleRowClick(app) }}
										>
											View
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className={styles.pagination}>
					<span className={styles.paginationInfo}>
						Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} applications
					</span>
					<div className={styles.paginationControls}>
						<button
							className={styles.pageBtn}
							onClick={() => setCurrentPage(p => p - 1)}
							disabled={currentPage === 1}
						>
							←
						</button>
						{visiblePages.map(p => (
							<button
								key={p}
								className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}
								onClick={() => setCurrentPage(p)}
							>
								{p}
							</button>
						))}
						<button
							className={styles.pageBtn}
							onClick={() => setCurrentPage(p => p + 1)}
							disabled={currentPage === totalPages}
						>
							→
						</button>
					</div>
				</div>
			</main>

			{selectedApp && (
				<ApplicationDetails
					application={selectedApp}
					onClose={() => setSelectedApp(null)}
					onEdit={() => setModal({ mode: 'edit', app: selectedApp })}
				/>
			)}

			{modal && (
				<ApplicationModal
					mode={modal.mode}
					application={modal.app}
					onClose={() => setModal(null)}
					onSubmit={(data) => { console.log(data); setModal(null) }}
					onDelete={() => { console.log('delete'); setModal(null) }}
				/>
			)}
		</div>
	)
}